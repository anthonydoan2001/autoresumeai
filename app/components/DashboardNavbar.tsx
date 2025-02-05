"use client";

import Link from "next/link";
import SignOutButton from "@/app/components/auth/SignOutButton";
import { ThemeToggle } from "./ThemeToggle";

export function DashboardNavbar() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-background">
      <div className="container mx-auto max-w-[1200px] flex items-center">
        <Link className="flex items-center" href="/dashboard">
          <span className="font-bold text-2xl text-foreground">
            AutoResumeAI
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
