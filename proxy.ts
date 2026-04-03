"use server";

import { NextRequest, NextResponse } from "next/server";

import { getUserSession } from "./data/dal/getUserSession";

const protectedRoutes = [
  "/settings",
  "/create-post",
];
const publicRoutes = ["/login", "/signup", "/", "/profile", "/search"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  if (isPublicRoute) return NextResponse.next();

  const session = await getUserSession();

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (
    !session?.profileCreated &&
    !req.nextUrl.pathname.startsWith("/settings")
  ) {
    return NextResponse.redirect(new URL("/settings", req.nextUrl));
  }

  const requestHeaders = new Headers(req.headers);

  if (session && session.userId) {
    requestHeaders.set("x-user-id", session.userId);
    requestHeaders.set("x-profile-created", String(session.profileCreated));
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/",
    "/post/:path*",
    "/settings/:path*",
    "/create-post/:path*",
    "/search/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
  ],
};
