import { cookies } from "next/headers";
import { BookOpen, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CompleteLessonButton from "@/components/student/completeLessonButton";
import CertificateButton from "@/components/student/certificateButton";
interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
}

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
interface Module {
  id: string;
  courseId: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
}

interface CourseResponse {
  success: boolean;
  message: string;
  course: Course;
  modules: Module[];
}

async function getCourse(courseId: string): Promise<CourseResponse | null> {
  const storeCookie = await cookies();

  try {
    const response = await fetch(
      `http://localhost:5000/api/student/courses/${courseId}`,
      {
        method: "GET",
        headers: {
          cookie: storeCookie.toString(),
        },
        cache: "no-store",
      },
    );
    if (!response.ok) {
      return null;
    }
    const data: CourseResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch course details:", error);
    return null;
  }
}
export default async function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getCourse(id);
  if (!data) {
    console.log("Course data not found");
    return null;
  }
  const { course, modules } = data;
  return (
    <div className="space-y-8 ">
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/student/myCourse" />}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Courses
      </Button>
      <div>
        <h1 className="text-3xl font-semibold">{course.title}</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          {course.description}
        </p>
      </div>
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h2 className="text-2xl font-semibold">Course Content</h2>
        </div>
        {modules.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No modules available
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {modules.map((module) => (
              <Card key={module.id}>
                <CardHeader>
                  <CardTitle>
                    Module {module.position}: {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {module.lessons.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No Lesson available in this module.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="border p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <PlayCircle className="mt-0.5 h-5 w-5 shrink-0" />
                            <div className="flex-1">
                              <h3 className="font-medium">
                                Lesson {lesson.title}: {lesson.position}
                              </h3>
                              {lesson.description && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {lesson.description}
                                </p>
                              )}
                              {lesson.videoUrl && (
                                <a
                                  href={lesson.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 inline-block text-sm font-medium underline"
                                >
                                  Watch Video
                                </a>
                              )}
                              <div className="mt-4">
                                <CompleteLessonButton
                                  courseId={course.id}
                                  lessonId={lesson.id}
                                  initialCompleted={lesson.completed}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-6">
                        <h2 className="mb-3 text-xl font-semibold">
                          Certificate
                        </h2>

                        <CertificateButton courseId={course.id} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
