import {z} from "zod" ;
export const createModuleSchema = z.object({
    title: z.string().trim().min(3, {message: "Module title must be ar least 3 characters"})
    .max(100, {message: "Module title is too long"}),
});

export type CreateModuleInput = z.infer<typeof createModuleSchema>;