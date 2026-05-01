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
        return NextResponse.json({ error: "USERNAME_TAKEN: This identifier is already claimed." }, { status: 400 });
      }
    }

    // 2. Resolve the Profile Node (Find by phone)
    const vendor = await prisma.profile.findFirst({
       where: { phone: normalizedPhone }
    });

    if (!vendor) {
       return NextResponse.json({ error: "PROFILE_NOT_FOUND: Please register at the gate first." }, { status: 404 });
    }

    // 3. Finalize the Profile Upgrade
    const updatedVendor = await prisma.profile.update({
      where: { id: vendor.id },
      data: {
        name: name || undefined,
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
      message: "COMMAND_DECK_INITIALIZED",
      vendor: updatedVendor
    });

  } catch (error: any) {
    console.error("Onboarding API error:", error);
    return NextResponse.json({ error: "INTERNAL_CORE_FAILURE: " + error.message }, { status: 500 });
  }
}
