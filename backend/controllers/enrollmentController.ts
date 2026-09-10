import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { and, eq, desc, asc } from "drizzle-orm";
import { db } from "../db/index.ts";
import { course } from "../db/schema/course-schema.ts";
import { enrollments } from "../db/schema/enrollment-schema.ts";
import { modules } from "../db/schema/module-schema.ts";
import { lessons } from "../db/schema/lesson-schema.ts";
import { success } from "zod";

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
      .where(and(eq(course.id, courseId), eq(course.status, "published")))
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
};
export const getMyCourse = async(
  req: Request ,
  res: Response ,
)=>{
    try {
      const user = (req as Request & {
      user?:{
        id: string,
        role: string,
      },
    }).user

    if(!user?.id)
    {
      return res.status(401).json({
        success: false ,
        message: "Unauthorized User"
      });
    };
    const myCourse = await db.select({
      enrollmentId: enrollments.id,
      enrollAt: enrollments.enrollAt,
      id: course.id,
      instructorId: course.instructorId,
      title: course.title,
      slug: course.slug,
      description:course.description,
      cover_image_url: course.cover_image_url,
      status: course.status,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    })
    .from(enrollments)
    .innerJoin(course, eq(enrollments.courseId, course.id))
    .where(eq(enrollments.courseId, user.id))
    .orderBy(desc(enrollments.enrollAt));

    return res.status(200).json({
      success: true,
      message: "My course fetch successfully",
      courses:myCourse
    });
    } catch (error) {
      console.log("Get my course  error:" , error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch my courses",
      })
    }

}

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const user = (req as Request & {
      user?: {
        id: string;
      };
    }).user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized person",
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
   const [courseData] = await db.select().from(course).where(eq(course.id, courseId)).limit(1);
   if(!courseData)
   {
    return res.status(404).json({
      success: false ,
      message: "Course not found"
    })
   }
  const getModules = await db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(asc(modules.position));
  if(getModules.length === 0)
   {
    return res.status(404).json({
      success: false ,
      message: "Modules not found",
    })
   }
   const getLessonForEveryModule = await Promise.all(
    getModules.map(async (module)=>{
      const moduleLessons = await db.select().from(lessons).where(eq(lessons.moduleId, module.id)).orderBy(asc(lessons.position));
      return {
        ...module ,
        lesson: moduleLessons
      }
    })
   )
   return res.status(200).json({
    success: false ,
    message: "Lessons in Module fetch successfully",
    course: courseData,
    module: getLessonForEveryModule
   })
  } catch (error) {
    console.log("Get course by id error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};