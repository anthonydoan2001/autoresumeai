import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { DEFAULT_USER_PERMISSIONS } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

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
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });

    if (existingUser) {
      // Check if this email is associated with OAuth accounts
      if (existingUser.accounts.length > 0) {
        const providers = existingUser.accounts.map((acc) => acc.provider);
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
    const newUser = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role: "USER",
        permissions: DEFAULT_USER_PERMISSIONS,
        tier: "FREE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        tier: true,
        subscriptionStatus: true,
      },
    });

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
  }
}
