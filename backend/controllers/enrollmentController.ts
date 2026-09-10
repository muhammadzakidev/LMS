import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { and, eq, desc } from "drizzle-orm";

import { db } from "../db/index.ts";
import { course } from "../db/schema/course-schema.ts";
import { enrollments } from "../db/schema/enrollment-schema.ts";

export const enrollCourse = async (req: Request, res: Response) => {
  try {
    const user = (
      req as Request & {
        user?: {
          id: string;
          role: string;
        };
      }
    ).user;
    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const rawCourseId = req.params.courseId;
    const courseId = Array.isArray(rawCourseId) ? rawCourseId[0] : rawCourseId;
    const [courseExist] = await db
      .select()
      .from(course)
      .where(and(eq(course.id, user.id), eq(course.status, "published")))
      .limit(1);
    if (!courseExist) {
      return res.status(404).json({
        success: false,
        message: "Published course not found",
      });
    }
    const [alreadyEnroll] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, user.id),
          eq(enrollments.courseId, courseId),
        ),
      )
      .limit(1);
    if (alreadyEnroll) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }
    //insert for enrollment
    const [enrollment] = await db
      .insert(enrollments)
      .values({
        id: randomUUID(),
        studentId: user.id,
        courseId,
      })
      .returning();
    return res.status(201).json({
      success: true,
      message: "Course enrolled successfully",
      enrollment,
    });
  } catch (error) {
    console.log("Enroll course error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to enroll course",
    });
  }
};
export const getUploadedCourse = async (
    req:Request ,
    res: Response,
)=>{
    try {
        const publishCourse = await db.select().from(course).where(eq(course.status, "published")).orderBy(desc(course.createdAt));
        return res.status(200).json({
            success: true ,
            message: "Published courses fetched Successfully",
            course: publishCourse,
        });
    } catch (error) {
        console.log("Get published courses error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
        });
    }
}