import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { subscriptionGuard } from "./app/middleware/subscription-guard";

// Define protected and pro-only paths
const authRequiredPaths = ["/dashboard", "/api/user", "/api/resumes"];

const proOnlyPaths = [
  "/api/pro",
  "/dashboard/pro",
  "/api/resumes/ai",
  "/api/templates/premium",
];

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup");
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

  // Allow API auth routes to pass through
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Check if route requires authentication
  const requiresAuth = authRequiredPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  // Handle authentication
  if (requiresAuth && !isAuth) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    );
  }

  // Check subscription access for pro-only routes
  const subscriptionCheck = await subscriptionGuard(req, proOnlyPaths);
  if (subscriptionCheck instanceof NextResponse) {
    return subscriptionCheck;
  }

  return NextResponse.next();
}

// Configure paths to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
