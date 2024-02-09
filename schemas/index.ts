import { z } from "zod";

// Schema for the login credentials
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, { message: "Password is required" }),
});

// Schema for the register page
export const RegisterSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  email: z.string().email(),
  password: z.string().min(4, { message: "Minimum 4 characters required" }),
});
