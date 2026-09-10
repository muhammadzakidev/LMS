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

interface DeleteCourseProps {
  courseId: string;
  courseTitle: string;
}
export default function DeleteCourse({
  courseId,
  courseTitle,
}: DeleteCourseProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");

    try {
      setIsLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/instructor/courses/${courseId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete course");
        return;
      }

      router.refresh();
    } catch (error) {
      console.log("Delete course error:", error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" className="flex-1">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Course?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{courseTitle}</strong>? All
            modules and lessons inside this course will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete Course"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
