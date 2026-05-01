import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json([], { status: 200 });
    }

    // NORMALIZE PHONE
    let normalizedPhone = phone.replace(/\s+/g, "");
    if (normalizedPhone.startsWith("0")) {
      normalizedPhone = "+254" + normalizedPhone.substring(1);
    } else if (!normalizedPhone.startsWith("+") && /^\d+$/.test(normalizedPhone)) {
      normalizedPhone = "+" + normalizedPhone;
    }

    // 1. Resolve Profile to ensure correct ownerId link
    const vendor = await prisma.profile.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          { username: phone }
        ]
      }
    });

    if (!vendor) {
      return NextResponse.json([], { status: 200 });
    }

    // 2. Fetch bookings linked to specific vendor's vehicles
    const transactions = await prisma.booking.findMany({
      where: {
        vehicle: {
          ownerId: vendor.id
        }
      },
      include: {
        vehicle: true,
        zone: true
      },
      orderBy: {
        checkInAt: "desc"
      }
    });

    return NextResponse.json(Array.isArray(transactions) ? transactions : []);
  } catch (error: any) {
    console.error("Vendor transactions fetch error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
