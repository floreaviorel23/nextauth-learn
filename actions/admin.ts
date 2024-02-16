"use server";

import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function admin() {
  const user = await currentUser();
  const role = user?.role;

  if (role === UserRole.ADMIN) return { success: "Allowed" };
  else return { error: "Not allowed!" };
}
