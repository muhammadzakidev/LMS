import Link from "next/link";
import { cookies } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { BookOpen, Plus, Pencil } from "lucide-react";

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
  course: Course[];  // ✅ Changed from "courses" to "course"
}

async function getCourse(): Promise<Course[]> {
  const cookieStore = await cookies();
  try {
    const response = await fetch(
      "http://localhost:5000/api/instructor/courses",
      {
        method: "GET",
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      },
    );
    if (!response.ok) {
      return [];
    }

    const data: CourseResponse = await response.json();
    console.log("STATUS:", response.status);
    console.log("COURSE API RESPONSE:", data);
    return data.course ?? [];  // ✅ Changed from data.courses to data.course
  } catch (error) {
    console.log("Fetch courses error:", error);
    return [];
  }
}

export default async function InstructorCoursePage() {
  const courses = await getCourse();

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Courses
          </h1>

          <p className="text-muted-foreground">
            Create and manage your courses.
          </p>
        </div>

        <Button
          nativeButton={false}
          render={<Link href="/instructor/courses/create" />}
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Button>
      </div>

      {/* Empty State */}
      {courses.length === 0 ? (
        <Card className="py-10">
          <CardContent className="flex flex-col items-center justify-center">
            <BookOpen className="mb-3 h-12 w-12 text-muted-foreground" />

            <h2 className="text-xl font-semibold">
              No courses yet
            </h2>

            <p className="mt-2 text-center text-sm text-muted-foreground">
              Create your first course to get started.
            </p>
          </CardContent>
        </Card>
      ) : (

        /* Course Cards */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col overflow-hidden"
            >
              {course.cover_image_url ? (
                <Image
                  src={course.cover_image_url}
                  alt={course.title}
                  width={600}
                  height={300}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-muted">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between gap-3">

                  <CardTitle className="line-clamp-1">
                    {course.title}
                  </CardTitle>

                  <Badge
                    variant={
                      course.status === "published"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {course.status}
                  </Badge>

                </div>

                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-xs text-muted-foreground">
                  Created{" "}
                  {new Date(
                    course.createdAt
                  ).toLocaleDateString()}
                </p>
              </CardContent>

              <CardFooter className="gap-2">

               

                <Button
                  className="flex-1"
                  nativeButton={false}
                  render={
                    <Link
                      href={`/instructor/courses/${course.id}`}
                    />
                  }
                >
                  Manage
                </Button>

              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

