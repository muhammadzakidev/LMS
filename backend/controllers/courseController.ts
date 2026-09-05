import { course } from "../db/schema/course-schema.ts";
import { db } from "../db/index.ts";
import { Request, Response } from "express";
import {
  createCourseSchema,
  updateCourseSchema,
  updateCourseStatusSchema,
} from "../validation/courseValidation.ts";
import { eq, and } from "drizzle-orm";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: { id: string } }).user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized person",
      });
    }
    const validation = createCourseSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ",
        errors: validation.error.flatten(),
      });
    }
    const baseSlug = validation.data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

    const [newCourse] = await db
      .insert(course)
      .values({
        id: crypto.randomUUID(),
        instructorId: user.id,
        title: validation.data.title,
        description: validation.data.description,
        cover_image_url: validation.data.cover_image_url,
        slug: slug,
        status: "published",  // ✅ Changed to published
      })
      .returning();

    return res.status(200).json({
      success: true,
      message: "course create successfully",
      course: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something happened during course creation.",
      error,
    });
  }
};

export const getMyCourse = async (req: Request, res: Response) => {
  try {
    const user = (req as Request & { user?: { id: string } }).user;
    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized User",
      });
    }
    const result = await db
      .select()
      .from(course)
      .where(eq(course.instructorId, user.id));
    return res.status(201).json({
      success: true,
      message: "Get My Course Successfully",
      course: result,
    });
  } catch (error) {
    console.log("Error occur during get my course");
    return res.status(500).json({
      success: false,
      message: "During Fetch Error occur",
      error,
    });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
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
        message: "Unauthorized User",
      });
    }
    const courseId = req.params.id as string;
    const result = await db
      .select()
      .from(course)
      .where(and(eq(course.id, courseId), eq(course.instructorId, user.id)));
    return res.status(201).json({
      success: true,
      message: "Get course by id successfully",
      course: result,
    });
  } catch (error) {
    console.log("Error occur during get course by id");
    return res.status(500).json({
      success: false,
      message: "During fetch error occur",
      error,
    });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
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
        message: "Unauthorized User",
      });
    }
    const courseId = req.params.id as string;
    const validation = updateCourseSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid course data",
        errors: validation.error.issues,
      });
    }
    const data = validation.data;
    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }
    const [result] = await db
      .update(course)
      .set(data)
      .where(and(eq(course.id, courseId), eq(course.instructorId, user.id)))
      .returning();
    if (!result) {
      return res.status(404).json({
        success: false,
        message:
          "your are not authorized to update this course or also course not fount yet",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: result,
    });
  } catch (error) {
    console.log("Error occur during update the course");
    return res.status(500).json({
      success: false,
      message: "During update course error occur",
      error,
    });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
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
        message: "Unauthorized User",
      });
    }

    const courseId = req.params.id as string;
    const result = await db
      .delete(course)
      .where(and(eq(course.id, courseId), eq(course.instructorId, user.id)))
      .returning();
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      course: result,
    });
  } catch (error) {
    console.log("Error occur during delete the course");
    return res.status(500).json({
      success: false,
      message: "During delete course error occur",
      error,
    });
  }
};

export const updateCourseStatus = async (req: Request, res: Response) => {
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
        message: "Unauthorized User",
      });
    }
    const validation = updateCourseStatusSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid course status data",
        errors: validation.error.issues,
      });
    }
    const status = validation.data.status as "draft" | "published";
    const courseId = req.params.id as string;
    const [result] = await db
      .update(course)
      .set({ status })
      .where(and(eq(course.id, courseId), eq(course.instructorId, user.id)))
      .returning();
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "You are not update the status of this course ",
      });
    }
    console.log("courseId:", req.params.id);
    console.log("user:", user);
    console.log("status:", validation.data.status);
    console.log("Course status updated successfully", result);
    return res.status(200).json({
      success: true,
      message: "Course status updated successfully",
      course: result,
    });
  } catch (error) {
    console.log("Error occur during update the course status");
    return res.status(500).json({
      success: false,
      message: "During update course status error occur",
      error,
    });
  }
};
