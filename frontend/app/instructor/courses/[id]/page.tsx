import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Pencil } from "lucide-react";

import AddModuleDialog from "@/components/instructor/addModule";
import AddLessonFeature from "@/components/instructor/addLesson";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
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

interface Module {
  id: string;
  courseId: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

interface ModuleResponse {
  success: boolean;
  message: string;
  modules: Module[];
}

interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
}

interface LessonResponse {
  success: boolean;
  message: string;
  lessons: Lesson[];
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
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

async function getModules(courseId: string): Promise<Module[]> {
  const cookieStore = await cookies();

  try {
    const response = await fetch(
      `http://localhost:5000/api/instructor/courses/${courseId}/modules`,
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

    const data: ModuleResponse = await response.json();

    return data.modules ?? [];
  } catch (error) {
    console.log("Get modules error:", error);
    return [];
  }
}

async function getLessons(
  courseId: string,
  moduleId: string,
): Promise<Lesson[]> {
  const cookieStore = await cookies();

  try {
    const response = await fetch(
      `http://localhost:5000/api/instructor/courses/${courseId}/modules/${moduleId}/lessons`,
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

    const data: LessonResponse = await response.json();

    return data.lessons ?? [];
  } catch (error) {
    console.log("Get lessons error:", error);
    return [];
  }
}

export default async function ManageCoursePage({ params }: PageProps) {
  const { id } = await params;

  const course = await getCourse(id);

  if (!course) {
    notFound();
  }

  const modules = await getModules(id);

  const moduleWithLessons = await Promise.all(
    modules.map(async (module) => {
      const lessons = await getLessons(id, module.id);

      return {
        ...module,
        lessons,
      };
    }),
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="pl-0"
        nativeButton={false}
        render={<Link href="/instructor/dashboard" />}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Course Details */}
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

      {/* Course Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Content</CardTitle>

              <CardDescription>
                Organize your course into modules and lessons.
              </CardDescription>
            </div>

            <AddModuleDialog courseId={course.id} />
          </div>
        </CardHeader>

        <CardContent>
          {modules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <BookOpen className="mb-3 h-10 w-10 text-muted-foreground" />

              <p className="font-medium">No modules added yet</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add your first module to start building the course.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {moduleWithLessons.map((module) => (
                <div key={module.id} className="rounded-lg border">
              
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted font-semibold">
                      {module.position}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{module.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Module {module.position}
                      </p>
                    </div>

                    <AddLessonFeature
                      courseId={course.id}
                      moduleId={module.id}
                    />
                  </div>

                  {module.lessons.length > 0 && (
                    <div className="border-t px-4 py-3">
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 rounded-md bg-muted/50 p-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background text-sm font-medium">
                              {lesson.position}
                            </div>

                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {lesson.title}
                              </p>

                              {lesson.description && (
                                <p className="line-clamp-1 text-xs text-muted-foreground">
                                  {lesson.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
