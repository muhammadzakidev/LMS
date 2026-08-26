import { z } from "zod";
export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3  characters long" })
    .max(30, { message: "Name must be at most 30 characters long" }),
  email: z.email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(8, { message: "Password must be at most 8 characters long" }),
  role: z.enum(["Students", "Instructor"], {
    message: "Role must be either Students or Instructor",
  }),
});

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .trim()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(8, { message: "Password must be at most 8 characters long" }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
