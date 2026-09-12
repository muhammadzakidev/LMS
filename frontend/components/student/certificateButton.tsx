"use client";
import { useState } from "react";
import { Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface certificateButtonProps {
  courseId: string;
}

interface CertificateResponse {
  success: boolean;
  message: string;
  certificate?: {
    id: string;
    certificateNumber: string;
    issueAt: string;
  };
}

export default function CertificateButton({
  courseId,
}: certificateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [certificateNumber, setCertificateNumber] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleCertificate = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/student/courses/${courseId}/certificate`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const data: CertificateResponse = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        alert(data.message);
        return;
      }

      if (data.certificate) {
        setCertificateNumber(data.certificate.certificateNumber);
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Something went wrong while generating your certificate." );
      console.log("certificate error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-3">
      <Button
        onClick={handleCertificate}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <Award className="h-4 w-4 mr-2" />
        {loading ? "Generating..." : "Get Certificate"}
      </Button>

      {certificateNumber && (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span>Certificate #{certificateNumber}</span>
        </div>
      )}

      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
