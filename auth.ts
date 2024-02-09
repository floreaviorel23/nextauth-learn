import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./data/user";

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
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    // async signIn({ user }) {
    //   //It tells TypeScript that even though something looks like it could be null, it can trust you that it's not
    //   const existingUser = await getUserById(user.id!);

    //   //if (!existingUser || !existingUser.emailVerified) return false;

    //   return true;
    // },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        //@ts-ignore
        session.user.role = token.role;
      }
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
