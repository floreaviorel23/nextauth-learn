import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getAccountByUserId, getUserById } from "./data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { UserRole } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  //We can export signIn and signOut to use in server components or server actions
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  events: {
    async linkAccount({ user, account, profile }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      //Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      // //It tells TypeScript that even though something looks like it could be null, it can trust you that it's not
      const existingUser = await getUserById(user.id!);

      // Prevent credentials signin without email verification
      if (!existingUser || !existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        //Delete two factor confirmation for next signIn
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },

    async jwt({ token }) {
      const existingUser = await getUserById(token.sub!);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
