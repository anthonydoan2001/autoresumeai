"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function MainNavbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isDashboard = pathname.startsWith("/dashboard");

  // Don't show this navbar on auth pages or dashboard
  if (isAuthPage || isDashboard) return null;

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-background">
      <div className="container mx-auto max-w-[1200px] flex items-center">
        <Link className="flex items-center" href="/">
          <span className="font-bold text-2xl text-foreground">
            AutoResumeAI
          </span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link
            className={`text-sm font-medium hover:text-foreground/80 ${
              pathname === "/pricing"
                ? "text-blue-600 dark:text-blue-400"
                : "text-foreground"
            }`}
            href="/pricing"
          >
            Pricing
          </Link>
          <Link
            className={`text-sm font-medium hover:text-foreground/80 ${
              pathname === "/features"
                ? "text-blue-600 dark:text-blue-400"
                : "text-foreground"
            }`}
            href="/features"
          >
            Features
          </Link>
          <Link
            className={`text-sm font-medium hover:text-foreground/80 ${
              pathname === "/about"
                ? "text-blue-600 dark:text-blue-400"
                : "text-foreground"
            }`}
            href="/about"
          >
            About
          </Link>
          <div className="h-4 w-px bg-border mx-2" />
          <ThemeToggle />
          <Link
            className="text-sm font-medium text-foreground hover:text-foreground/80"
            href="/login"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
