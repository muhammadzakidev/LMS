import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { BookOpen } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  course: Course[];  // ✅ Changed to "course" (singular, but array)
}

// Get instructor courses
async function getCourses(): Promise<Course[]> {
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
      }
    );

    if (!response.ok) {
      return [];
    }

    const data: CourseResponse = await response.json();

    return data.course ?? [];  // ✅ Changed from data.courses
  } catch (error) {
    console.log("Dashboard courses error:", error);
    return [];
  }
}

export default async function InstructorDashboard() {
  // Auth check
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "Instructor") {
    redirect("/403");
  }

  // Get courses
  const courses = await getCourses();

  return (
    <div className="space-y-6">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold">
          Instructor Dashboard
        </h1>

        <p className="text-muted-foreground">
          Manage your courses and course content.
        </p>
      </div>

      {/* Courses */}
      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="mb-3 h-10 w-10 text-muted-foreground" />

            <p className="font-medium">
              No courses created yet
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {courses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden"
            >

              {/* Cover Image */}
              {course.cover_image_url ? (
                <Image
                  src={course.cover_image_url}
                  alt={course.title}
                  width={500}
                  height={300}
                  loading="eager"
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-muted">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
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

              <CardContent>
                <Link
                  href={`/instructor/courses/${course.id}`}
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Manage Course
                </Link>
              </CardContent>

            </Card>
          ))}

        </div>
      )}

    </div>
  );
}