import { NextRequest, NextResponse } from "next/server";

import { getUserSession } from "./data/dal/getUserSession";

const protectedRoutes = ["/settings", "/create-post"];
const publicRoutes = ["/login", "/signup", "/", "/profile", "/search", "/post"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith("/settings") || path.startsWith("/create-post");
  const isPublicRoute =
    path === "/" ||
    path === "/login" ||
    path === "/signup" ||
    path.startsWith("/post") ||
    path.startsWith("/profile") ||
    path.startsWith("/search");

  if (isPublicRoute) return NextResponse.next();

  const session = await getUserSession();

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (
    !session?.user.username &&
    !req.nextUrl.pathname.startsWith("/settings")
  ) {
    return NextResponse.redirect(new URL("/settings", req.nextUrl));
  }

  const requestHeaders = new Headers(req.headers);

  if (session) requestHeaders.set("user-id", session?.user.id);

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
