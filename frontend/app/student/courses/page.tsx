import { cookies } from "next/headers";
import Image from "next/image";
import { BookOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import EnrollButton from "@/components/student/enrollButton";

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
  course: Course[];
}

async function getPubCourse(): Promise<Course[]> {
  const cookieStore = await cookies();

  try {
    const response = await fetch(
      "http://localhost:5000/api/student/courses",
      {
        method: "GET",
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.log(
        "Failed to fetch courses:",
        response.status,
      );

      return [];
    }

    const data: CourseResponse = await response.json();

    return data.course ?? [];
  } catch (error) {
    console.log("Student courses fetch error:", error);

    return [];
  }
}

export default async function StudentCoursePage() {
  const courses = await getPubCourse();

  return (
    <div className="space-y-6 ">
      <div>
        <h1 className="text-3xl font-bold">
          Explore Courses
        </h1>

        <p className="text-muted-foreground">
          Browse available courses and start learning.
        </p>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-10">
            <BookOpen className="mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-xl font-semibold">
              No courses available
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              There are currently no published courses.
            </p>
          </CardContent>
        </Card>
      ) : (
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

                  <Badge>Published</Badge>
                </div>

                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <p className="text-xs text-muted-foreground">
                  Start learning this course today.
                </p>
              </CardContent>

              <CardFooter>
                <EnrollButton courseId={course.id} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
