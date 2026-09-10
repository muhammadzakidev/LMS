import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, GraduationCap } from "lucide-react";

import { getAuthSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function StudentDashboardPage() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "Students") {
    redirect("/403");
  }

  return (
    <div className="space-y-8">
   
      <div>
        <h1 className="text-3xl font-bold">
          Welcome, {session.user.name}
        </h1>

        <p className="mt-1 text-muted-foreground">
          Continue learning or explore new courses.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <Card>
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>

            <CardTitle>Explore Courses</CardTitle>

            <CardDescription>
              Browse available courses and enroll in
              something new.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              className="w-full"
              nativeButton={false}
              render={<Link href="/student/courses" />}
            >
              Explore Courses
            </Button>
          </CardContent>
        </Card>

        {/* My Courses */}
        <Card>
          <CardHeader>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>

            <CardTitle>My Courses</CardTitle>

            <CardDescription>
              Access the courses you have already enrolled
              in.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              nativeButton={false}
              render={<Link href="/student/myCourse" />}
            >
              View My Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}