import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { phone, name, email, businessAddress, username, password } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "IDENTITY_NOT_FOUND: Session timeout or invalid entry." }, { status: 400 });
    }

    // NORMALIZE PHONE
    let normalizedPhone = phone.replace(/\s+/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+254" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("+") && /^\d+$/.test(normalizedPhone)) {
      normalizedPhone = "+" + normalizedPhone;
    }

    // 1. Check if Username is available (if provided)
    if (username) {
      const existingUser = await prisma.profile.findFirst({
        where: { 
          username,
          NOT: { phone: normalizedPhone }
        }
      });

      if (existingUser) {
        return NextResponse.json({ error: "USERNAME_TAKEN: This handle is already in use." }, { status: 400 });
      }
    }

    // 2. SELF-HEALING UPSERT: Create or Update the profile
    const updatedVendor = await prisma.profile.upsert({
      where: { phone: normalizedPhone },
      update: {
        name: name || undefined,
        email: email || undefined,
        businessAddress: businessAddress || undefined,
        username: username || undefined,
        password: password || undefined,
        onboardingCompleted: true,
        role: "vendor"
      },
      create: {
        phone: normalizedPhone,
        name: name || "Vendor Agent",
        email: email || undefined,
        businessAddress: businessAddress || undefined,
        username: username || undefined,
        password: password || undefined,
        onboardingCompleted: true,
        role: "vendor"
      }
    });

    return NextResponse.json({
      success: true,
      message: "IDENTITY_AUTHORIZED_AND_SYNCED",
      vendor: updatedVendor
    });

  } catch (error: any) {
    console.error("Onboarding API error:", error);
    return NextResponse.json({ error: "IDENTITY_INITIALIZATION_FAILED: " + error.message }, { status: 500 });
  }
}
