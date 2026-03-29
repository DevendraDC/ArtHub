"use server";

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "./lib/better-auth/auth";

const protectedRoutes = [
  "/",
  "/settings",
  "/create-post",
  "/search",
  "/profile",
];
const publicRoutes = ["/login", "/signup"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  if (isPublicRoute) return NextResponse.next();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (
    (!session?.user.name || !session?.user.username) &&
    !req.nextUrl.pathname.startsWith("/settings")
  ) {
    return NextResponse.redirect(new URL("/settings", req.nextUrl));
  }

  const requestHeaders = new Headers(req.headers);

  if (session?.user) {
    requestHeaders.set("x-user-id", session.user.id ?? "");
    requestHeaders.set("x-user-name", session.user.name ?? "");
    requestHeaders.set("x-user-username", session.user.username ?? "");
    requestHeaders.set("x-user-image", session.user.image ?? "");
    requestHeaders.set("x-user-bio", session.user.bio ?? "");
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
