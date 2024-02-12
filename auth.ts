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

  // events: {
  //   async linkAccount({ user, account, profile }) {
  //     console.log("--> Link account :p");
  //     console.log({ user: user }, { account: account }, { profile: profile });

  //     await db.user.update({
  //       where: { id: user.id },
  //       data: { emailVerified: new Date() },
  //     });
  //   },
  // },

  callbacks: {
    async signIn({ user, account }) {
      console.log("--> Callback singIn");
      console.log({ user: user }, { account: account });

      //Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      // //It tells TypeScript that even though something looks like it could be null, it can trust you that it's not
      const existingUser = await getUserById(user.id!);

      // Prevent credentials signin without email verification
      if (!existingUser || !existingUser?.emailVerified) return false;

      // TODO: Add 2FA check

      return true;
    },

    async session({ session, token }) {
      console.log("--> Callback session");
      console.log({ session: session }, { token: token });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        //@ts-ignore
        session.user.role = token.role;
      }
      return session;
    },

    async jwt({ token, account, profile }) {
      console.log("--> Callback jwt");
      console.log({ token: token });

      console.log("--> Callback jwt1");

      const existingUser = await getUserById(token.sub!);

      if (!existingUser) return token;
      console.log("--> Callback jwt2");

      token.role = existingUser.role;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
