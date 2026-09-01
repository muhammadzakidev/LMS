
import { course } from "../db/schema/course-schema.ts";
import { db } from "../db/index.ts";
import { Request, Response } from "express";
import { createCourseSchema } from "../validation/courseValidation.ts";
import { eq } from "drizzle-orm";

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
        errors: validation.error.flatten()
      });
    }
    const baseSlug = validation.data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

    const [newCourse] = await db.insert(course).values({
      id: crypto.randomUUID(),
      instructorId: user.id,
      title: validation.data.title,
      description: validation.data.description,
      cover_image_url: validation.data.cover_image_url,
      slug: slug,
      status: "draft"
    }).returning();

    return res.status(200).json({
        success: true,
        message:"course create successfully",
        course: newCourse
    })
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Something happened during course creation.",
        error
    })
  }
};


export const getMyCourse = async (req: Request , res: Response) =>{
  try {
    const user = (req as Request & { user?: { id: string } }).user;
    if(!user?.id)
    {
      return res.status(401).json({
        success: false ,
        message: "Unauthorized User"
      })
    }
    const result = await db.select().from(course).where(eq(course.instructorId, user.id));
    return res.status(201).json({
      success: true,
      message: "Get My Course Successfully",
      course: result 

    });
  } catch (error) {
    console.log("Error occur during get my course");
    return res.status(500).json({
      success: false ,
      message: "During Fetch Error occur",
      error
    })
    
  }
}