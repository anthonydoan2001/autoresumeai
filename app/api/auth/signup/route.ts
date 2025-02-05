import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { DEFAULT_USER_PERMISSIONS } from "@/app/lib/auth";
import { AuthUser } from "@/app/types/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Signup request body:", body);

    const { name, email, password } = body;

    if (!email || !password) {
      console.log("Missing required fields:", {
        email: !!email,
        password: !!password,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // First check if user exists with this email
    const existingUsers = await prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*) as count
      FROM users
      WHERE email = ${email}
    `;

    if (existingUsers[0].count > 0) {
      // Check if this email is associated with OAuth accounts
      const oauthAccounts = await prisma.$queryRaw<{ provider: string }[]>`
        SELECT provider
        FROM accounts a
        JOIN users u ON u.id = a.userId
        WHERE u.email = ${email}
      `;

      if (oauthAccounts.length > 0) {
        const providers = oauthAccounts.map(
          (acc: { provider: string }) => acc.provider
        );
        return NextResponse.json(
          {
            error: "Account exists with social login",
            message: `This email is already associated with a ${providers.join(
              " or "
            )} account. Please sign in with that provider.`,
            providers,
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            error: "Account already exists",
            message:
              "An account with this email already exists. Please sign in or use a different email.",
          },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with default role and permissions
    const result = await prisma.$queryRaw<AuthUser[]>`
      INSERT INTO users (
        id,
        name,
        email,
        password,
        "emailVerified",
        image,
        role,
        permissions,
        tier,
        "subscriptionStatus",
        "createdAt",
        "updatedAt"
      ) VALUES (
        gen_random_uuid(),
        ${name || null},
        ${email},
        ${hashedPassword},
        null,
        null,
        'USER',
        ${DEFAULT_USER_PERMISSIONS}::text[],
        'FREE',
        null,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      RETURNING 
        id,
        name,
        email,
        role,
        permissions,
        tier,
        "subscriptionStatus"
    `;

    const newUser = result[0];

    console.log("User created successfully:", {
      id: newUser.id,
      email: newUser.email,
      tier: newUser.tier,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("Detailed signup error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return NextResponse.json(
      {
        error: "Failed to create account",
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
