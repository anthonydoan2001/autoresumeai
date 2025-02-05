import { Suspense } from "react";
import { AuthForm } from "../components/auth-form";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm type="signup" />
    </Suspense>
  );
}
