"use server";

import { z } from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

// Server action for the register
// (MUST be an async function)
export async function register(values: z.infer<typeof RegisterSchema>) {
  //Back-end zod data validation for register fields
  // console.log(values);
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields!" };

  const { email, name, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) return { error: "Email already in use!" };

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  //TODO: Send verification token email
  return { success: "User created!" };
}
