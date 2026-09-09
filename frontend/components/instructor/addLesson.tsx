"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface addLessonProps {
  courseId: string;
  moduleId: string;
}

export default function AddLessonFeature({
  courseId,
  moduleId,
}: addLessonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateLesson = async () => {
    setError("");
    if (title.trim().length < 3) {
      setError("Lesson title must be at least 3 characters");
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/instructor/courses/${courseId}/modules/${moduleId}/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            videoUrl: videoUrl.trim(),
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to create lesson");
        return;
      }
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setError("");
      setOpen(false);

      router.refresh();
    } catch (error) {
      console.log("Create lesson error:", error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button size="sm">
            <Plus className="h-4 w-4"/>
            Add Lesson
        </Button>}/>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Lesson</DialogTitle>
                   <DialogDescription>
            Add a new lesson to this module.
          </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
            <Label htmlFor={`title-${moduleId}`}>
              Lesson Title
            </Label>
               <Input
              id={`title-${moduleId}`}
              placeholder="e.g. What is Node.js?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            </div>
              <div className="space-y-2">
            <Label htmlFor={`description-${moduleId}`}>
              Description
            </Label>

            <Textarea
              id={`description-${moduleId}`}
              placeholder="Lesson description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
            <div className="space-y-2">
            <Label htmlFor={`video-${moduleId}`}>
              Video URL
            </Label>

            <Input
              id={`video-${moduleId}`}
              type="url"
              placeholder="Enter the video url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}
          </div>
          <DialogFooter>
            <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
            <Button
            type="button"
            disabled={isLoading}
            onClick={handleCreateLesson}
          >
            {isLoading ? "Creating..." : "Create Lesson"}
          </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
