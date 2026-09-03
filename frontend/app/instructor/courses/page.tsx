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
  coverImageUrl: string | null;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

interface CourseResponse {
  success: boolean;
  message: string;
  courses: Course[];
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
     return data.courses ?? [];
  } catch (error) {
    console.log("Fetch courses error:", error);
    return [];
  }
}

export default async function InstructorCoursePage() {
  const courses = await getCourse();
  return (
    <div className="space-y-6">
     
      {courses.length === 0 && (
        <Card className="py-10">
          <CardContent className="flex flex-col items-center justify-center">
           
            <h2 className="text-xl font-semibold">No courses yet</h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Create your First course to get started
            </p>
            <Button  className="mt-5">
              <Link href="/instructor/courses/create" className="flex flex-row gap-2">
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {courses.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden">
              {course.coverImageUrl ? (
                <Image
                  src={course.coverImageUrl}
                  alt={course.title}
                  width={400}
                  height={192}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="flex h-48 items-center justify-center bg-muted">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                  <Badge
                    variant={
                      course.status === "published" ? "default" : "secondary"
                    }
                  >
                    {course.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-1">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-xs text-muted-foreground">
                  Created {new Date(course.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" className="flex-1" >
                  <Link href={`/instructor/courses/${course.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button className="flex-1" >
                  <Link href={`/instructor/courses/${course.id}`}>
                    Manage
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
