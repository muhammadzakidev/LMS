import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
interface EnRollProps {
  courseId: string;
}

export default function EnrollButton({ courseId }: EnRollProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleEnroll = async () => {
    setMessage("");
    try {
      const response = await fetch(
        `http://localhost:5000/api/student/courses/${courseId}/enroll`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Failed to enroll in course");
        return;
      }
      setMessage("Enrolled successfully");
      router.refresh();
    } catch (error) {
      console.log("Enrollment error:", error);
      setMessage("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full space-y-2">
      <Button
        type="button"
        className="w-full"
        disabled={isLoading}
        onClick={handleEnroll}
      >
        {isLoading ? "Enrolling..." : "Enroll now"}
      </Button>
      {message && (
        <p className="text-center text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}
