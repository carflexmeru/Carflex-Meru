import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { phone, name, email, businessAddress, username, password } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "IDENTITY_NOT_FOUND: Session timeout or invalid entry." }, { status: 400 });
    }

    // 1. Check if Username is available
    const existingUser = await prisma.profile.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json({ error: "USERNAME_TAKEN: This identifier is already claimed by another vendor." }, { status: 400 });
    }

    // 2. Finalize the Profile Upgrade
    const updatedVendor = await prisma.profile.update({
      where: { phone },
      data: {
        name,
        email,
        businessAddress,
        username,
        password,
        onboardingCompleted: true,
        role: "vendor"
      }
    });

    return NextResponse.json({
      success: true,
      message: "COMMAND_DECK_INITIALIZED",
      vendor: updatedVendor
    });

  } catch (error: any) {
    console.error("Onboarding API error:", error);
    return NextResponse.json({ error: "INTERNAL_CORE_FAILURE" }, { status: 500 });
  }
}
