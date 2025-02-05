"use client";

import { Button } from "@/app/components/ui/button";
import { Info, AlertCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { useState } from "react";

interface AuthErrorProps {
  message: string;
  providers?: string[];
  onGoogleSignIn?: () => void;
  onGithubSignIn?: () => void;
}

export function AuthError({
  message,
  providers,
  onGoogleSignIn,
  onGithubSignIn,
}: AuthErrorProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Determine error type and customize presentation
  const isOAuthError =
    message.includes("Please sign in with") ||
    message.includes("already registered with");
  const isCredentialsError =
    message.includes("password") || message.includes("email");
  const isNoAccountError = message.includes("No account found");

  // Customize title and icon based on error type
  let title = "Authentication Error";
  let icon = <XCircle className="h-5 w-5 text-destructive" />;

  if (isOAuthError) {
    title = "Social Login Required";
    icon = <Info className="h-5 w-5 text-blue-600" />;
  } else if (isNoAccountError) {
    title = "Account Not Found";
    icon = <AlertCircle className="h-5 w-5 text-yellow-600" />;
  } else if (isCredentialsError) {
    title = "Sign In Failed";
    icon = <XCircle className="h-5 w-5 text-destructive" />;
  }

  const socialButtons = providers && (
    <div className="flex flex-col sm:flex-row gap-2 mt-4">
      {providers.includes("google") && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onGoogleSignIn?.();
            setIsOpen(false);
          }}
          className="bg-white hover:bg-gray-50 w-full sm:w-auto"
        >
          Sign in with Google
        </Button>
      )}
      {providers.includes("github") && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onGithubSignIn?.();
            setIsOpen(false);
          }}
          className="bg-white hover:bg-gray-50 w-full sm:w-auto"
        >
          Sign in with GitHub
        </Button>
      )}
    </div>
  );

  // Add helpful context based on error type
  let enhancedMessage = message;
  if (isNoAccountError) {
    enhancedMessage = `${message} You can create a new account using email/password or choose one of our social login options.`;
  } else if (message.includes("Incorrect password")) {
    enhancedMessage = `${message} Please note that passwords are case-sensitive. Make sure your caps lock is off and try again.`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {icon}
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            {enhancedMessage}
          </DialogDescription>
        </DialogHeader>
        {socialButtons && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Available sign in options:
            </p>
            {socialButtons}
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="w-full sm:w-auto"
              onClick={() => setIsOpen(false)}
            >
              OK
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
