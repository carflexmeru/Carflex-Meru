import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({ error: "Phone and Password are required." }, { status: 400 });
    }

    // 1. Find the Vendor Profile (Phone or Username)
    const vendor = await prisma.profile.findFirst({
      where: {
        OR: [
          { phone: phone },
          { username: phone }
        ]
      }
    });

    if (!vendor) {
      return NextResponse.json({ error: "ASSET_IDENTITY_NOT_FOUND: Profile not registered." }, { status: 404 });
    }

    // 2. Dual-State Validation
    let isValid = false;

    if (!vendor.onboardingCompleted) {
      // INITIAL STATE: Compare with ID Number
      isValid = vendor.idNumber === password;
    } else {
      // PERMANENT STATE: Compare with Custom Password
      isValid = vendor.password === password;
    }

    if (!isValid) {
      return NextResponse.json({ error: "AUTHORIZATION_DENIED: Invalid credentials for this identity node." }, { status: 401 });
    }

    // 3. Return Vendor Context
    return NextResponse.json({
      success: true,
      id: vendor.id,
      name: vendor.name,
      onboardingCompleted: vendor.onboardingCompleted,
      role: vendor.role
    });

  } catch (error: any) {
    console.error("Vendor login error:", error);
    return NextResponse.json({ error: "INTERNAL_CORE_FAILURE" }, { status: 500 });
  }
}
