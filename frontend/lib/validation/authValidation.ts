import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters Long" })
    .max(30, {
      message: "Name must be at most 30 characters long",
    }),
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters Long" })
    .max(8, { message: "Password must be at 8 characters Long" }),
 role: z.enum(["Students" , "Instructor"], {
    message: "Role must be either Students or Instructor" })
});

export const loginSchema = z.object({
    email: z.email({message: "Please enter a valid email address"}),
    password: z.string().min(6, {message: "Password must be at Least 6 characters Long"}).max(8, {message: "Password must be at 8 characters Long"}),
})
export type SignupInput = z.infer<typeof signupSchema>;
export type loginInput = z.infer<typeof loginSchema>;