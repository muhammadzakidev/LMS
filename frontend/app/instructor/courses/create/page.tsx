"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImageIcon } from "lucide-react";
import Link from "next/link";
import {
  createCourseSchema,
  type CreateCourseInput,
} from "@/lib/validation/courseValidation";
// cspell:disable-next-line
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";



import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateCoursePage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseInput>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      coverImageUrl: "",
    },
  });

  const coverImageUrl = useWatch({
    control,
    name: "coverImageUrl",
  });
  const onSubmit = async (data: CreateCourseInput) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/instructor/courses",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        console.log("Create course failed :", result);
        return;
      }
      router.push("/instructor/courses");
      router.refresh();
    } catch (error) {
      console.log("Create course error:", error);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button
        variant="ghost"
        className="pl-0"
       
      >
        <Link href="/instructor/courses" className="flex flex-row gap-2">
          <ArrowLeft className="mr-1 mt-0.5 h-4 w-4" />
          Back to Courses
        </Link>
      </Button>
        <div>
            <h1 className="text-3xl font-bold">
                Create Course
            </h1>
            <p className="mt-1 text-muted-foreground">
                Add the basic information for your new course
            </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>
                    Course Information
                </CardTitle>
                <CardDescription>
                    Enter the title, description and cover image
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                     <Label htmlFor="title">
                     Course Title
                     </Label>
                     <Input id="title" placeholder="Enter the text"
                     {
                        ...register("title")
                     }
                     />
                     {errors.title && (
                        <p className="text-sm text-destructive">
                            {errors.title.message}
                        </p>
                     )}
                    </div>
                    <div className="space-y-2">
                     <Label htmlFor="description">
                     Description
                     </Label>
                     <Textarea className="min-h-36 resize-none" id="description" placeholder="Describe what student will learn"
                     {...register('description')}
                     />
                     {
                        errors.description && (
                            <p className="text-sm text-destructive">
                                {errors.description.message}
                            </p>
                        )
                     }
                    </div>

                    <div className="space-y-3">
                        <Label>
                            Cover Image
                        </Label>
                        {!coverImageUrl && (
                            <div className="flex min-h-44 flex-col items-center justify-center gap-4 border border-dashed rounded-lg">
                                <ImageIcon className="h-10 w-10 text-muted-foreground"/>
                                <div className="text-center">
                                    <p className="text-sm font-semibold">
                                        Upload Course cover
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Maximum file size 4MB
                                    </p>
                                </div>
                                <UploadButton
                                  endpoint="courseCoverImage"
                                  url="http://localhost:5000/api/uploadthing"
                                  onClientUploadComplete={(files) => {
                                    const file = files?.[0];
                                    if (!file) return;

                                    setValue("coverImageUrl", file.ufsUrl, {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    });
                                  }}
                                  onUploadError={(error)=>{
                                    console.log("Upload error :" , error);
                                  }}
                                />
                            </div>
                        )}

                        {
                            coverImageUrl && (
                                <div className="space-y-3">
                                <Image
                                  src={coverImageUrl}
                                  alt="Course cover"
                                  width={600}
                                  height={400}
                                  className="h-auto w-full border rounded-lg object-cover"
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Cover Image uploaded.
                                    </p>
                                    <Button type="button" variant="outline" size="sm" onClick={()=>{
                                        setValue(
                                            "coverImageUrl",
                                            "",
                                            {
                                                shouldValidate: true
                                            }
                                        )
                                    }}>
                                      Remove
                                    </Button>
                                </div>
                                </div>
                            )
                        }
                        {
                            errors.coverImageUrl && (
                                <p className="text-sm text-destructive">
                                    {errors.coverImageUrl.message}
                                </p>
                            )
                        }
                    </div>
                    <div className="flex justify-center gap-3 border-t pt-6">
                        <Button type="button" variant="outline" onClick={()=>{
                            router.push("/instructor/courses")
                        }}>
                          Cancel
                        </Button>
                       <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating" : "Create course"}
                       </Button>
                    </div>

                        

                </form>
            </CardContent>
        </Card>
    </div>
  );
}
