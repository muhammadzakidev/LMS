import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { and, asc, eq, max } from "drizzle-orm";
import { db } from "../db/index.ts";
import { course } from "../db/schema/course-schema.ts";
import { modules } from "../db/schema/module-schema.ts";
import { lessons } from "../db/schema/lesson-schema.ts";
import { createLessonSchema } from "../validation/lessonValidation.ts";
export const createLesson = async (req: Request, res: Response) => {
  try {
    const { courseId: rawCourseId, moduleId } = req.params;
    const courseId = Array.isArray(rawCourseId) ? rawCourseId[0] : rawCourseId;
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
        message: "Unauthorized",
      });
    }
    const ownCourse = await db
      .select()
      .from(course)
      .where(and(eq(course.id, courseId), eq(course.instructorId, user.id)))
      .limit(1);
    if (!ownCourse.length) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const normalizedModuleId = Array.isArray(moduleId) ? moduleId[0] : moduleId;
    const module = await db
      .select()
      .from(modules)
      .where(
        and(eq(modules.id, normalizedModuleId), eq(modules.courseId, courseId)),
      )
      .limit(1);
    if (!module.length) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }
    const result = createLessonSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0]?.message ?? "Invalid lesson data",
      });
    }
    const { title, description, videoUrl } = result.data;
    const positionCheck = await db
      .select({
        maxPosition: max(lessons.position),
      })
      .from(lessons)
      .where(eq(lessons.moduleId, normalizedModuleId));

    const incPosition = (positionCheck[0]?.maxPosition ?? 0) + 1;
    const newLesson = await db
      .insert(lessons)
      .values({
        id: randomUUID(),
        moduleId: normalizedModuleId,
        title,
        description: description || null,
        videoUrl: videoUrl || null,
        position: incPosition,
      })
      .returning();
    return res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson: newLesson[0],
    });
  } catch (error) {
    console.log("Create lesson error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getLesson = async (req: Request, res: Response) => {
  try {
    const { courseId: rawCourseId, moduleId } = req.params;
    const courseId = Array.isArray(rawCourseId) ? rawCourseId[0] : rawCourseId;
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
        message: "Unauthorized",
      });
    }
    const courses = await db
      .select()
      .from(course)
      .where(and(eq(course.id, courseId), eq(course.instructorId, user.id)))
      .limit(1);
    if (!courses.length) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    const normalizedModuleId = Array.isArray(moduleId) ? moduleId[0] : moduleId;
    const module = await db
      .select()
      .from(modules)
      .where(
        and(
          eq(modules.id, normalizedModuleId),
          eq(modules.courseId, courseId),
        ),
      ).limit(1);
       if (!module.length) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }
      const moduleLessons = await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, normalizedModuleId))
      .orderBy(asc(lessons.position));

    return res.status(200).json({
      success: true,
      message: "Lessons fetched successfully",
      lessons: moduleLessons,
    });
  } catch (error) {
      console.log("Get lessons error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
