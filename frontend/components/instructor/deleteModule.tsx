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
interface deleteModuleProps {
  courseId: string;
  moduleId: string;
  moduleTitle: string;
}

export default function DeleteDialog({
  courseId,
  moduleId,
  moduleTitle,
}: deleteModuleProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/instructor/courses/${courseId}/modules/${moduleId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!response.ok) {
        const data = await response.json();

        console.log(data.message || "Failed to delete module");

        return;
      }
      router.refresh();
    } catch (error) {
      console.log("Delete module error:", error);
    }finally {
      setIsLoading(false);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Module?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{moduleTitle}</strong>? All
            lessons inside this module will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
