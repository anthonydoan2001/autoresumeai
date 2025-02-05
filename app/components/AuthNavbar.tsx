"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function AuthNavbar() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // Only show this navbar on auth pages
  if (!isAuthPage) return null;

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
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
            href="/pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
            href="/features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
            href="/about"
          >
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
