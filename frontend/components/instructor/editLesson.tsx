"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

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

interface EditLessonProps {
  courseId: string;
  moduleId: string;
  lessonId: string;
  currentTitle: string;
  currentDescription: string | null;
  currentVideoUrl: string | null;
}

export default function EditLesson({
  courseId,
  moduleId,
  lessonId,
  currentTitle,
  currentDescription,
  currentVideoUrl,
}: EditLessonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(currentTitle);

  const [description, setDescription] = useState(
    currentDescription ?? ""
  );

  const [videoUrl, setVideoUrl] = useState(
    currentVideoUrl ?? ""
  );

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateLesson = async () => {
    setError("");

    if (title.trim().length < 3) {
      setError(
        "Lesson title must be at least 3 characters"
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            videoUrl: videoUrl.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to update lesson"
        );
        return;
      }

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.log("Update lesson error:", error);

      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Lesson
          </DialogTitle>

          <DialogDescription>
            Update lesson information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor={`lesson-title-${lessonId}`}>
              Lesson Title
            </Label>

            <Input
              id={`lesson-title-${lessonId}`}
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label
              htmlFor={`lesson-description-${lessonId}`}
            >
              Description
            </Label>

            <Textarea
              id={`lesson-description-${lessonId}`}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <Label htmlFor={`lesson-video-${lessonId}`}>
              Video URL
            </Label>

            <Input
              id={`lesson-video-${lessonId}`}
              type="url"
              placeholder="https://youtube.com/..."
              value={videoUrl}
              onChange={(e) =>
                setVideoUrl(e.target.value)
              }
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isLoading}
            onClick={handleUpdateLesson}
          >
            {isLoading
              ? "Updating..."
              : "Update Lesson"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}