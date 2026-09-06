import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Pencil } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  instructorId: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

interface CourseResponse {
  success: boolean;
  message: string;
  course: Course;
}

async function getCourse(id: string): Promise<Course | null> {
  const cookieStore = await cookies();

  try {
    const response = await fetch(
      `http://localhost:5000/api/instructor/courses/${id}`,
      {
        method: "GET",
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const data: CourseResponse = await response.json();

    return data.course ?? null;
  } catch (error) {
    console.log("Get course error:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ManageCoursePage({ params }: PageProps) {
  const { id } = await params;

  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="pl-0"
        nativeButton={false}
        render={<Link href="/instructor/dashboard" />}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card className="overflow-hidden">
        {course.cover_image_url ? (
          <Image
            src={course.cover_image_url}
            alt={course.title}
            width={1200}
            height={500}
            className="h-64 w-full object-cover"
          />
        ) : (
          <div className="flex h-64 items-center justify-center bg-muted">
            <BookOpen className="h-14 w-14 text-muted-foreground" />
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{course.title}</CardTitle>

              <Badge
                variant={
                  course.status === "published" ? "default" : "secondary"
                }
              >
                {course.status}
              </Badge>
            </div>

            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href={`/instructor/courses/${course.id}/edit`} />}
            >
              <Pencil className="h-4 w-4" />
              Edit Course
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">{course.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center justify-center py-10">
            <BookOpen className="mb-3 h-10 w-10 text-muted-foreground" />

            <p className="font-medium">No modules added yet</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Add modules and lessons to build your course.
            </p>

            <Button className="mt-4">Add Module</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
