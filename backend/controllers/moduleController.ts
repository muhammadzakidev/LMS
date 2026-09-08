import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { and, asc, eq, max } from "drizzle-orm";
import { db } from "../db/index.ts";
import { modules } from "../db/schema/module-schema.ts";
import { course } from "../db/schema/course-schema.ts";
import { createModuleSchema } from "../validation/module.validation.ts";
export const createModule = async (req: Request, res: Response) => {
  try {
    const courseId = String(req.params.courseId);
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
    const courseOwn = await db
      .select()
      .from(course)
      .where(and(eq(course.id, courseId), eq(course.instructorId, user.id)))
      .limit(1);
    if (!courseOwn.length) {
      return res.status(404).json({
        success: false,
        message: "Course not found yet",
      });
    }
    const result = createModuleSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0]?.message,
      });
    }
    const { title } = result.data;
    const positionResult = await db
      .select({
        maxPosition: max(modules.position),
      })
      .from(modules)
      .where(eq(modules.courseId, courseId));
    const nextPosition = (positionResult[0]?.maxPosition ?? 0) + 1;
    const newModule = await db
      .insert(modules)
      .values({
        id: randomUUID(),
        courseId,
        title,
        position: nextPosition,
      })
      .returning();
    return res.status(201).json({
      success: true,
      message: "Module create successfully",
      module: newModule[0],
    });
  } catch (error) {
    console.log("During creation error", error);
    return res.status(500).json({
      success: false,
      message: "Course creation internal server error",
    });
  }
};

export const getModules = async (req: Request, res: Response) => {
  try {
    const courseId = String(req.params.courseId);
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
        message: "Unauthorized ",
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

    const courseModule = await db
      .select()
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(asc(modules.position));
    return res.status(201).json({
      success: true,
      message: "Modules Fetched Successfully",
      modules: courseModule,
    });
  } catch (error) {
    console.log("get module error in Modules", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateModule = async (req: Request, res: Response) => {
  try {
    const courseId = String(req.params.courseId);
    const moduleId = String(req.params.moduleId);
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

    const result = createModuleSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error.issues[0]?.message,
      });
    }

    const existingModule = await db
      .select()
      .from(modules)
      .where(and(eq(modules.id, moduleId), eq(modules.courseId, courseId)))
      .limit(1);

    if (!existingModule.length) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const updatedModule = await db
      .update(modules)
      .set({
        title: result.data.title,
        updatedAt: new Date(),
      })
      .where(and(eq(modules.id, moduleId), eq(modules.courseId, courseId)))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Module updated successfully",
      module: updatedModule[0],
    });
  } catch (error) {
    console.log("update module error", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    const courseId = String(req.params.courseId);
    const moduleId = String(req.params.moduleId);
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
    const existingModule = await db
      .select()
      .from(modules)
      .where(and(eq(modules.id, moduleId), eq(modules.courseId, courseId)))
      .limit(1);
    if (!existingModule.length) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }
    const delModule = await db
      .delete(modules)
      .where(and(eq(modules.id, moduleId), eq(modules.courseId, courseId)));

    return res.status(200).json({
      success: true,
      message: "Module deleted successfully",
      module: delModule,
    });
  } catch (error) {
    console.log("Delete module error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
