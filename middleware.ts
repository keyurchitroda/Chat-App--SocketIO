import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  if (!token && pathname !== "/signin" && pathname !== "/signup") {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }
  if (token && (pathname === "/signin" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
  return NextResponse.next(); // Allow request to proceed
}

export const config = {
  matcher: ["/signin/:path*", "/", "/signup", "/private/chat"],
};
