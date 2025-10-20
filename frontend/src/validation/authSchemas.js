import { z } from "zod";

// Schema for user login
export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(5, "password must be at least 5 characters long"),
});

// Schema for user registration
export const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.email("invalid email format"),
  password: z.string().min(5),
});
