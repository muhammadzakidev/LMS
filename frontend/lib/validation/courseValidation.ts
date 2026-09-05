import {z} from "zod";


export const createCourseSchema = z.object({
    title: z.string().trim().min(3, {message: "Title must be at least 3 characters"})
    .max(30, {message: "Title must be at most 30 characters "}),

    description: z.string().trim().min(20, {message: "Description must be at least 20 characters"})
    .max(2000, {message: "Description is too Long"} ),

     cover_image_url: z.url({
        message: "Please upload a valid cover image"
    }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>