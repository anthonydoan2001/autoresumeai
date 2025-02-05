import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function subscriptionGuard(
  req: NextRequest,
  proOnlyPaths: string[] = []
) {
  const token = await getToken({ req });

  // Allow public routes
  if (!proOnlyPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // No token means not authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const tier = token.tier as string;
  const subscriptionStatus = token.subscriptionStatus as string | null;
  const isPro = tier === "PRO" && subscriptionStatus === "active";

  // If trying to access pro-only route without pro subscription
  if (!isPro) {
    // If it's an API route
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Pro subscription required" },
        { status: 403 }
      );
    }

    // If it's a page route, redirect to upgrade page
    return NextResponse.redirect(new URL("/upgrade", req.url));
  }

  return NextResponse.next();
}

// Example usage in middleware.ts:
/*
import { subscriptionGuard } from "./middleware/subscription-guard";

const proOnlyPaths = [
  "/api/pro",
  "/dashboard/pro",
  // Add other pro-only paths
];

export default async function middleware(req: NextRequest) {
  // Check subscription access first
  const subscriptionCheck = await subscriptionGuard(req, proOnlyPaths);
  if (subscriptionCheck instanceof NextResponse) {
    return subscriptionCheck;
  }

  // Continue with other middleware checks...
  return NextResponse.next();
}
*/
