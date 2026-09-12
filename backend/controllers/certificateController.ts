import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../db/index.ts";
import { enrollments } from "../db/schema/enrollment-schema.ts";
import { modules } from "../db/schema/module-schema.ts";
import { lessons } from "../db/schema/lesson-schema.ts";
import { lessonProgress } from "../db/schema/lessson-progress-schema.ts";
import { certificate } from "../db/schema/certificate-schema.ts";

export const generateCertificate = async (req: Request, res: Response) => {
  try {
    const user = (
      req as Request & {
        user?: {
          id: string;
        };
      }
    ).user;
    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
    const rawCourseId = req.params.courseId;

    const courseId = Array.isArray(rawCourseId) ? rawCourseId[0] : rawCourseId;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course id is required",
      });
    }
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, user.id),
          eq(enrollments.courseId, courseId),
        ),
      )
      .limit(1);
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }
    const [totalResult] = await db
      .select({
        totalLesson: sql<number>`count(${lessons.id})`,
      })
      .from(lessons)
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(eq(modules.courseId, courseId));
    const totalLessons = Number(totalResult.totalLesson);
    if (totalLessons === 0) {
      return res.status(400).json({
        success: false,
        message: "Course has no lessons",
      });
    }
    const [completedResult] = await db
      .select({
        completedLessons: sql<number>`count(${lessonProgress.id})`,
      })
      .from(lessonProgress)
      .innerJoin(lessons, eq(lessonProgress.lessonId, lessons.id))
      .innerJoin(modules, eq(lessons.moduleId, modules.id))
      .where(
        and(
          eq(lessonProgress.studentId, user.id),
          eq(modules.courseId, courseId),
        ),
      );
    const completeLesson = Number(completedResult.completedLessons);
    console.log("TOTAL LESSONS:", totalLessons);
    console.log("COMPLETED LESSONS:", completeLesson);
    console.log("STUDENT ID:", user.id);
    console.log("COURSE ID:", courseId);
    if (completeLesson !== totalLessons) {
      return res.status(400).json({
        success: false,
        message: "Complete all lessons before generating certificate",
        totalLessons,
        completeLesson,
      });
    }
    const [existCertificate] = await db
      .select()
      .from(certificate)
      .where(
        and(
          eq(certificate.studentId, user.id),
          eq(certificate.courseId, courseId),
        ),
      )
      .limit(1);
    if (existCertificate) {
      return res.status(200).json({
        success: true,
        message: "Certificate already exist",
        certificate: existCertificate,
      });
    }
    const certificateNumber = `CERTIFICATE-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const [certificates] = await db
      .insert(certificate)
      .values({
        id: randomUUID(),
        studentId: user.id,
        courseId,
        certificateNumber,
      })
      .returning();
    return res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      certificate: certificates,
    });
  } catch (error) {
    console.log("Generate certificate error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate certificate",
    });
  }
};
