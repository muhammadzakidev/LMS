import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MyCourse {
  enrollmentId: string;
  enrolledAt: string;
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
  courses: MyCourse[];
}

async function getMyCourse(): Promise<MyCourse[]> {
  const storeCookies = await cookies();
  try {
    const response = await fetch("http://localhost:5000/api/student/myCourse", {
      method: "GET",
      headers: {
        cookie: storeCookies.toString(),
      },
      cache: "no-cache",
    });
    const data: CourseResponse = await response.json();
    return data.courses ?? [];
   
  }
   catch (error) {
    console.log("My courses fetch error:", error);
    return [];
  }
}
 export default async function MyCoursePage(){
      const course = await getMyCourse();
      return (
        <div className="space-y-6">
          <div>
             <h1 className="text-3xl font-bold">
                My Courses
             </h1>
             <p className="text-muted-foreground">
              Access the course you enroll in
             </p>
          </div>
          {
            course.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="mb-4 h-12 w-12 text-muted-foreground"/>
                   <h2 className="text-xl font-semibold">
                    No Enrolled Courses
                   </h2>
                   <p className="mt-2 text-sm text-muted-foreground">
                      Explore available courses and enroll first.
                   </p>
                   <Button className="mt-5"  nativeButton={false}
                      render={<Link href="/student/courses" />}>
                      Explore Course
                   </Button>
                </CardContent>
              </Card>
            ): (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {course.map((courses)=>(
                  <Card key={courses.enrollmentId} className="flex flex-col overflow-hidden">
                     {courses.cover_image_url ? (
                        <Image
                  src={courses.cover_image_url}
                  alt={courses.title}
                  width={600}
                  height={300}
                  className="h-48 w-full object-cover"
                />
                     ):(
                         <div className="flex h-48 items-center justify-center bg-muted">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                     )}
                     <CardHeader>
                      <CardTitle className="line-clamp-1">
                       {courses.title}
                      </CardTitle>
                        <CardDescription className="line-clamp-2">
                  {courses.description}
                </CardDescription>
                     </CardHeader>
                      <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Enrolled on{" "}
                  {new Date(courses.enrolledAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button  className="w-full"
                  nativeButton={false}
                  render={
                    <Link
                      href={`/student/courses/${courses.id}`}
                    />
                  }>
                  Continue Learning
                </Button>
              </CardFooter>
                  </Card>
                ))}
              </div>
            )
          }

        </div>
      );
    }
