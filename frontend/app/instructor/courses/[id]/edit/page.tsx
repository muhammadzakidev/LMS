"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ImageIcon } from "lucide-react";

import {
  createCourseSchema,
  type CreateCourseInput,
} from "@/lib/validation/courseValidation";

import { UploadButton } from "@/lib/uploadthing";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();

  const courseId = params.id as string;

  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [pageError, setPageError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      cover_image_url: "",
    },
  });

  const coverImageUrl = watch("cover_image_url");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoadingCourse(true);
        setPageError("");

        const response = await fetch(
          `http://localhost:5000/api/instructor/courses/${courseId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        const data: CourseResponse = await response.json();

        if (!response.ok) {
          setPageError(data.message || "Failed to fetch course");
          return;
        }

        reset({
          title: data.course.title,
          description: data.course.description,
          cover_image_url: data.course.cover_image_url ?? "",
        });
      } catch (error) {
        console.log("Fetch course error:", error);
        setPageError("Something went wrong");
      } finally {
        setIsLoadingCourse(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, reset]);

  const onSubmit = async (data: CreateCourseInput) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/instructor/courses/${courseId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to update course");
        return;
      }

      router.push(`/instructor/courses/${courseId}`);

      router.refresh();
    } catch (error) {
      console.log("Update course error:", error);
      alert("Something went wrong");
    }
  };

  if (isLoadingCourse) {
    return <div className="py-10">Loading course...</div>;
  }

  if (pageError) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">{pageError}</p>

        <Button
          nativeButton={false}
          render={<Link href="/instructor/courses" />}
        >
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button
        variant="ghost"
        className="pl-0"
        nativeButton={false}
        render={<Link href={`/instructor/courses/${courseId}`} />}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Course
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Edit Course</h1>

        <p className="mt-1 text-muted-foreground">
          Update your course information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>

          <CardDescription>
            Update the title, description and cover image.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>

              <Input
                id="title"
                placeholder="Enter course title"
                {...register("title")}
              />

              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>

              <Textarea
                id="description"
                className="min-h-36 resize-none"
                placeholder="Describe your course"
                {...register("description")}
              />

              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Cover Image</Label>

              {!coverImageUrl && (
                <div className="flex min-h-44 flex-col items-center justify-center gap-4 rounded-lg border border-dashed">
                  <ImageIcon className="h-10 w-10 text-muted-foreground" />

                  <div className="text-center">
                    <p className="text-sm font-semibold">Upload Course Cover</p>

                    <p className="text-xs text-muted-foreground">
                      Maximum file size 4MB
                    </p>
                  </div>

                  <UploadButton
                    endpoint="courseCoverImage"
                    onClientUploadComplete={(files) => {
                      const file = files?.[0];

                      if (!file) return;

                      setValue("cover_image_url", file.ufsUrl, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    onUploadError={(error) => {
                      console.log("Upload error:", error);

                      alert(error.message || "Upload failed");
                    }}
                  />
                </div>
              )}

              {coverImageUrl && (
                <div className="space-y-3">
                  <Image
                    src={coverImageUrl}
                    alt="Course cover"
                    width={600}
                    height={300}
                    className="h-56 w-full rounded-lg border object-cover"
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setValue("cover_image_url", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              )}

              {errors.cover_image_url && (
                <p className="text-sm text-destructive">
                  {errors.cover_image_url.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/instructor/courses/${courseId}`)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Course"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
