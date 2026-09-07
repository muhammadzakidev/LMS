import {z} from "zod" ;

export const createLessonSchema = z.object({
    title:z.string().trim().min(3, {message: "Lesson title must be at least 3 characters"}).max(100, {message: "Lesson title is too long"}),
    description: z.string().trim().max(2000, {message: "Description is too long "}).optional(),
    videoUrl: z.url({message: "Invalid video URL"}).or(z.literal("")),

});

export type CreateLessonInput =z.infer<typeof createLessonSchema>