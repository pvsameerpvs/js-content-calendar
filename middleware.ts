import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session_token");
  const { pathname } = request.nextUrl;

  // 1. Protected Routes: /home, /calendar
  // If no session, redirect to Login (/)
  if (!session && (pathname.startsWith("/home") || pathname.startsWith("/calendar"))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Auth Routes: / (Login)
  // If session exists, redirect to /home
  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home/:path*", "/calendar/:path*"],
};
