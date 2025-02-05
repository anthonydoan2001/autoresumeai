"use client";

import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <Button
      variant="ghost"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-foreground hover:text-foreground/80"
    >
      Sign Out
    </Button>
  );
}
