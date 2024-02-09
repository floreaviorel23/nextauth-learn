"use server";

import { z } from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

// Server action for the login
// (MUST be an async function)
export async function login(values: z.infer<typeof LoginSchema>) {
  //Back-end zod data validation for login fields
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success)
    return { error: "Invalid fields!", success: "" };

  const { email, password } = validatedFields.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError)
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Nope" };
          break;

        default:
          return { error: "Something went wrong!" };
          break;
      }
    throw error;
  }
}