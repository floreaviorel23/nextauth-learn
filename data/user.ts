import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch (e) {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({ where: { id } });
    return user;
  } catch (e) {
    return null;
  }
}

export async function getAccountByUserId(id: string) {
  try {
    const account = await db.account.findUnique({ where: { id } });
    return account;
  } catch (e) {
    return null;
  }
}
