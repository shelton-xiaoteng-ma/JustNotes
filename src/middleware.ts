import { updateSession } from "@/utils/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

const isPublicRoute = (request: NextRequest) => {
  const publicRoutes = [
    /^\/$/, // Root path
    /^\/sign-in(.*)/, // Sign-in path
    /^\/sign-up(.*)/, // Sign-up path
    /^\/callback(.*)/, // Sign-up path
    /^\/error$/, // Error page
    /^\/api(.*)/, // Error page
  ];
  return publicRoutes.some((route) => route.test(request.nextUrl.pathname));
};

export async function middleware(request: NextRequest) {
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}`);

  if (isPublicRoute(request)) {
    console.log("Public route detected. Skipping authentication.");
    return NextResponse.next();
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
