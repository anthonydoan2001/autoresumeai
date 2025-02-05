import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      permissions: string[];
      tier: string;
      subscriptionStatus: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string | null;
    name?: string | null;
    role: string;
    permissions: string[];
    tier: string;
    subscriptionStatus: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    permissions: string[];
    tier: string;
    subscriptionStatus: string | null;
    accessToken?: string;
  }
}
