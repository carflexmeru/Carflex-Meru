import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({ error: "Phone and Password are required." }, { status: 400 });
    }

    // NORMALIZE PHONE
    let normalizedPhone = phone.replace(/\s+/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+254" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("+") && /^\d+$/.test(normalizedPhone)) {
      normalizedPhone = "+" + normalizedPhone;
    }

    // 1. Find the Vendor Profile (Phone or Username)
    const vendor = await prisma.profile.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          { username: phone }
        ]
      }
    });

    if (!vendor) {
      return NextResponse.json({ error: "ASSET_IDENTITY_NOT_FOUND: Profile not registered." }, { status: 404 });
    }

    // 2. Resilient Validation (Checks both Initial and Permanent Keys)
    const isInitialMatch = vendor.idNumber === password;
    const isPermanentMatch = vendor.password && vendor.password === password;
    const isValid = isInitialMatch || isPermanentMatch;

    if (!isValid) {
      return NextResponse.json({ error: "AUTHORIZATION_DENIED: Invalid credentials." }, { status: 401 });
    }

    // 3. Return Vendor Context
    return NextResponse.json({
      success: true,
      id: vendor.id,
      name: vendor.name,
      phone: vendor.phone,
      onboardingCompleted: vendor.onboardingCompleted,
      role: vendor.role
    });

  } catch (error: any) {
    console.error("Vendor login error:", error);
    return NextResponse.json({ error: "INTERNAL_CORE_FAILURE" }, { status: 500 });
  }
}
