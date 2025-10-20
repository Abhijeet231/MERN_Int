import { email, z } from "zod";

// Schema for creating a new agent
export const createAgentSchema = z.object({
  name: z.string().min(2, "Name is required").nonempty("Name is required"),
  email: z.email("Invalid Email"),
  mobile: z
    .string()
    .regex(
      /^\+\d{1,3}\s?\d{7,15}$/,
      "Please enter a valid mobile number with country code"
    ),
  password: z.string().min(5, "Password must be 5 characters long"),
});
