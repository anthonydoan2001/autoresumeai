"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h2 className="text-3xl font-semibold text-gray-800">Sign In</h2>
      <button
        onClick={() => signIn()}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
      >
        Sign In with Credentials
      </button>
    </div>
  );
}
