import { Session } from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthUser } from "@/app/types/auth";
import { randomUUID } from "crypto";
import { prisma } from "./prisma";

export type UserRole = "USER" | "ADMIN";

export type Permission =
  | "create:resume"
  | "edit:resume"
  | "delete:resume"
  | "view:resume"
  | "manage:users"
  | "manage:roles";

export const DEFAULT_USER_PERMISSIONS: Permission[] = [
  "create:resume",
  "edit:resume",
  "delete:resume",
  "view:resume",
];

export const ADMIN_PERMISSIONS: Permission[] = [
  ...DEFAULT_USER_PERMISSIONS,
  "manage:users",
  "manage:roles",
];

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          response_type: "code",
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password to sign in.");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            accounts: true,
          },
        });

        // If no user found
        if (!user) {
          throw new Error(
            "No account found with this email address. Please check your email or sign up for a new account."
          );
        }

        // If user has OAuth accounts, direct them to use those
        if (user.accounts.length > 0) {
          const providers = user.accounts
            .map(
              (acc: { provider: string }) =>
                acc.provider.charAt(0).toUpperCase() + acc.provider.slice(1)
            )
            .join(" or ");
          throw new Error(
            `This email is registered with ${providers}. Please use the "${providers} Sign In" button${
              user.accounts.length > 1 ? "s" : ""
            } above.`
          );
        }

        // If user exists but has no password (OAuth user trying to use password)
        if (!user.password) {
          throw new Error(
            "This account was created using social login. Please use the same method to sign in."
          );
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error(
            "Incorrect password. Please try again or click 'Forgot Password' if you need to reset it."
          );
        }

        const authUser: AuthUser = {
          id: user.id,
          email: user.email || "",
          name: user.name,
          role: user.role,
          permissions: user.permissions,
          tier: user.tier,
          subscriptionStatus: user.subscriptionStatus,
        };

        return authUser;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user || !account) {
        throw new Error(
          "Unable to process sign in request. Please try again later."
        );
      }

      // Always allow credentials provider
      if (account.provider === "credentials") {
        return true;
      }

      try {
        if (!user.email) {
          throw new Error(
            "Unable to access email from your social account. Please ensure you have an email associated with your social profile and try again."
          );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
          include: {
            accounts: true,
          },
        });

        // If user exists
        if (existingUser) {
          // Check if they're trying to use the same provider they signed up with
          const hasProvider = existingUser.accounts.some(
            (acc: { provider: string }) => acc.provider === account.provider
          );

          if (hasProvider) {
            return true; // Allow sign in with same provider
          }

          // If they have a password login
          if (existingUser.password) {
            throw new Error(
              "This email is registered with password authentication. Please use your password to sign in."
            );
          }

          // If they used a different OAuth provider
          const usedProvider = existingUser.accounts[0]?.provider;
          if (usedProvider) {
            throw new Error(
              `This email is registered with ${
                usedProvider.charAt(0).toUpperCase() + usedProvider.slice(1)
              }. Please use the "${
                usedProvider.charAt(0).toUpperCase() + usedProvider.slice(1)
              } Sign In" button instead.`
            );
          }
        }

        // If no user exists, create a new one
        const userId = randomUUID();
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
          await tx.user.create({
            data: {
              id: userId,
              name: user.name || null,
              email: user.email,
              emailVerified: new Date(),
              image: user.image || null,
              role: "USER",
              permissions: DEFAULT_USER_PERMISSIONS,
              tier: "FREE",
            },
          });
          await tx.account.create({
            data: {
              userId: userId,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          });
        });

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        throw error;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthUser;
        token.id = authUser.id;
        token.role = authUser.role;
        token.permissions = authUser.permissions;
        token.tier = authUser.tier;
        token.subscriptionStatus = authUser.subscriptionStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.tier = token.tier;
        session.user.subscriptionStatus = token.subscriptionStatus;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getRolePermissions = (role: UserRole): Permission[] => {
  switch (role) {
    case "ADMIN":
      return ADMIN_PERMISSIONS;
    case "USER":
      return DEFAULT_USER_PERMISSIONS;
    default:
      return [];
  }
};

export const hasPermission = (
  userPermissions: string[],
  requiredPermission: Permission
): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasRole = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  if (requiredRole === "USER") {
    return ["USER", "ADMIN"].includes(userRole);
  }
  return userRole === requiredRole;
};

export const isAdmin = (userRole: UserRole): boolean => {
  return userRole === "ADMIN";
};

interface AuthSession extends Session {
  user: {
    role: UserRole;
    permissions: string[];
  } & Session["user"];
}

// Middleware helper functions
export const withPermission = (permission: Permission) => {
  return async (session: AuthSession | null) => {
    if (!session?.user?.permissions) return false;
    return hasPermission(session.user.permissions, permission);
  };
};

export const withRole = (role: UserRole) => {
  return async (session: AuthSession | null) => {
    if (!session?.user?.role) return false;
    return hasRole(session.user.role, role);
  };
};
