import {z} from "zod";


export const createCourseSchema = z.object({
    title: z.string().trim().min(3, {message: "Title must be at least 3 characters"})
    .max(100, {message: "Title must be at most 100 characters "}),

    description: z.string().trim().min(10, {message: "Description must be at least 10 characters"})
    .max(2000, {message: "Description is too Long"} ),

    coverImageUrl: z.url({
        message: "Please upload a valid cover image"
    }),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>