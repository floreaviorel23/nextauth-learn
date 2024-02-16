import { z } from "zod";

// Schema for the login credentials
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, { message: "Password is required" }),
  code: z.optional(z.string()),
});

// Schema for the register page
export const RegisterSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  email: z.string().email(),
  password: z.string().min(4, { message: "Minimum 4 characters required" }),
});

// Schema for the reset password form
export const ResetSchema = z.object({
  email: z.string().email(),
});

// Schema for the new password form
export const NewPasswordSchema = z.object({
  password: z.string().min(4, { message: "Minimum 4 characters required" }),
});

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
});
