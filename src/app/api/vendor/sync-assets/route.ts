import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Missing identity node." }, { status: 400 });
    }

    // 1. Identify Target (Permanent) and Source (Shadow) Profiles
    let normalizedPhone = phone.replace(/\s+/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+254" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("+") && /^\d+$/.test(normalizedPhone)) {
      normalizedPhone = "+" + normalizedPhone;
    }

    const shadowPhone = normalizedPhone.replace("+254", "0");

    const permanentProfile = await prisma.profile.findFirst({
      where: { OR: [{ phone: normalizedPhone }, { username: phone }] }
    });

    const shadowProfile = await prisma.profile.findFirst({
      where: { phone: shadowPhone }
    });

    if (!permanentProfile || !shadowProfile) {
      // If one is missing, check if vehicles are just detached or if no shadow exists.
      return NextResponse.json({ 
        message: "No shadow collision detected. Checking asset linkage...",
        permanentId: permanentProfile?.id,
        shadowId: shadowProfile?.id
      });
    }

    // 2. Perform the Asset Transfer
    const vehicleTransfer = await prisma.vehicle.updateMany({
      where: { ownerId: shadowProfile.id },
      data: { ownerId: permanentProfile.id }
    });

    // 3. Decommission the Shadow Profile
    await prisma.profile.delete({
      where: { id: shadowProfile.id }
    });

    return NextResponse.json({
      success: true,
      message: "ASSETS_RECOVERED_AND_SYNCED",
      assetsMoved: vehicleTransfer.count
    });

  } catch (error: any) {
    console.error("Asset Sync Error:", error);
    return NextResponse.json({ error: "SYNC_FAILURE", details: error.message }, { status: 500 });
  }
}
