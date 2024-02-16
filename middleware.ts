import authConfig from "./auth.config";
import NextAuth from "next-auth";

import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from "@/routes";

const { auth } = NextAuth(authConfig);

// @ts-ignore
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  //Next-auth API specific route. Every user should be allowed to access this route
  //(whether he's logged in or)
  //Returning null means do not do any actions regarding this
  if (isApiRoute) {
    return null;
  }

  //If the user is already logged in and he is accessing an auth route
  //redirect him to the default page (settings), so basically do not let him
  //revisit the login page as long as he is logged in
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  //If he is not logged in and wants to access a protected route
  //redirect him to the login page
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
  //Every other case will not redirect or trigger any other actions
  return null;
});

// The matcher determines what routes invoke the middleware
// eg. matcher: ["/auth/login"] will invoke it only on that route
// By default, it will be used on everything except the one provided by next-auth

// We changed the default matcher with the one used by Clerk
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
