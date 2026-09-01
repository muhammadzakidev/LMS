import { z } from "zod";
export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Name must be have 3 character Long" })
    .max(30, { message: "Name must be have 30 character Long" }),
  description: z
    .string()
    .trim()
    .min(20, { message: "Description must be have 20 character Long " })
    .max(2000, { message: "Description is too Long" }),
  cover_image_url: z
  .url("Cover image must have Valid URL"),
});
export const updateCourseSchema = z.object({
    title: z
    .string()
    .trim()
    .min(3, { message: "Name must be have 3 character Long" })
    .max(30, { message: "Name must be have 30 character Long" }),
    description: z
    .string()
    .trim()
    .min(20, { message: "Description must be have 20 character Long " })
    .max(2000, { message: "Description is too Long" }),
    cover_image_url: z
    .url("Cover image must have Valid URL"),
    status: z
    .enum(["draft" , "published"])
    
}).partial();

export const updateCourseStatusSchema = z.object({
    status: z
    .enum(["draft" , "published"])
});
export type CreateCourseInput = z.infer<typeof createCourseSchema> 
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>
export type UpdateCourseStatusInput = z.infer<typeof updateCourseStatusSchema>
