"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DeleteLessonProps {
  courseId: string;
  moduleId: string;
  lessonId: string;
  lessonTitle: string;
}

export default function DeleteLesson({
  courseId,
  moduleId,
  lessonId,
  lessonTitle,
}: DeleteLessonProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] =
    useState(false);

  const handleDeleteLesson = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();

        console.log(
          data.message || "Failed to delete lesson"
        );

        return;
      }

      router.refresh();
    } catch (error) {
      console.log(
        "Delete lesson error:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="destructive"
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        }
      />

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Lesson?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>{lessonTitle}</strong>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDeleteLesson}
            disabled={isLoading}
          >
            {isLoading
              ? "Deleting..."
              : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}