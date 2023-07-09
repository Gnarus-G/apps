import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const isAuthenticated = !!request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (!isAuthenticated && pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthenticated && pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/sign-in"],
};
