"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCallbackUrl } from "./use-callback-url";

interface AuthFormProps {
  type: "login" | "signup";
}

interface AuthError {
  message: string;
  providers?: string[];
}

export function useAuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();
  const callbackUrl = useCallbackUrl();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await signIn("google", {
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError({ message: result.error });
        return;
      }

      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      setError({ message: "Failed to sign in with Google" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await signIn("github", {
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError({ message: result.error });
        return;
      }

      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error("Github sign in error:", error);
      setError({ message: "Failed to sign in with Github" });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const name = formData.get("name") as string;

      if (type === "signup") {
        // Register new user
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          // Check if this is an OAuth account error
          if (data.providers) {
            setError({
              message: data.message || "Account exists with social login",
              providers: data.providers,
            });
            return;
          }
          // Handle other signup errors
          setError({
            message: data.error || "Account already exists",
          });
          return;
        }
      }

      // Sign in
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        // Check if the error message contains OAuth provider information
        if (result.error.includes("sign in with")) {
          const providers = result.error
            .replace("Please sign in with ", "")
            .split(" or ");
          setError({
            message: result.error,
            providers,
          });
          return;
        }
        setError({
          message:
            result.error === "CredentialsSignin"
              ? "Invalid email or password"
              : result.error,
        });
        return;
      }

      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error(type === "login" ? "Login error:" : "Signup error:", error);
      setError({
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleGoogleSignIn,
    handleGithubSignIn,
    onSubmit,
    isLoading,
    error,
  };
}
