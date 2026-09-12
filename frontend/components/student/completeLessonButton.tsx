"use client"
import { useState } from "react"
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompletionButtonProps {
    courseId: string,
    lessonId: string,
    initialCompleted: boolean;
}

export default function CompletionButton({
    courseId,
    lessonId,
}: CompletionButtonProps) {
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleComplete = async ()=>{
    try {
        setLoading(true);
        const response = await fetch(
            `http://localhost:5000/api/student/courses/${courseId}/lessons/${lessonId}/complete`,
            {
                method: "POST",
                credentials: "include",
            },
        );
        const data = await response.json();
        if (!response.ok) {
        console.log(data.message);
        return;
      }
        setCompleted(true);
    } catch (error) {
     console.log("Complete lesson error:", error);
    }finally {
      setLoading(false);
    }
  }
  return (
    <Button
    type="button"
      variant={completed ? "outline" : "default"}
      onClick={handleComplete}
      disabled={completed || loading}
    >
    {
        completed ? (
            <>
            <CheckCircle2 className="mr-2 h-4 w-4"/>
            Completed
            </>
        ) : loading ? (
            "saving"
        ):(
            "Mark as complete"
        )
    }
    </Button>
  )
}