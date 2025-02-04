"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to AutoResumeAI
      </h1>
      <p className="text-gray-600 text-lg">AI-powered resume optimization.</p>

      {session ? (
        <div>
          <p className="mt-4">Signed in as {session.user?.email}</p>
          <button
            onClick={() => signOut()}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => signIn()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg"
          >
            Login
          </button>
          <Link href="/signup">
            <button className="px-6 py-2 bg-green-500 text-white rounded-lg">
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
