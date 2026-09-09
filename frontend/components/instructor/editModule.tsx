"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface EditModuleDialogProps {
  courseId: string;
  moduleId: string;
  currentTitle: string;
}

export default function EditModule({
  courseId,
  moduleId,
  currentTitle,
}: EditModuleDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateModule = async () => {
    setError("");
    if (title.trim().length < 3) {
      setError("Module title must be at least 3 characters");
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/instructor/courses/${courseId}/modules/${moduleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: title.trim(),
          }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update module");
        return;
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.log("Update module error:", error);
      setError("Something went wrong");
    }finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Module</DialogTitle>
          <DialogDescription>Update the module title.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor={`edit-module-${moduleId}`}>Module Title</Label>
          <Input
            id={`edit-module-${moduleId}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
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
            onClick={updateModule}
          >
            {isLoading ? "Updating..." : "Update Module"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
