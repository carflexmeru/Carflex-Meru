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

    // 1. Resolve Profile
    const buyer = await prisma.profile.findFirst({
      where: {
        OR: [
          { phone: normalizedPhone },
          { username: phone }
        ]
      }
    });

    if (!buyer) {
      return NextResponse.json([], { status: 200 });
    }

    // 2. Fetch bookings where this user is the "agent" (The one who paid)
    const bookings = await prisma.booking.findMany({
      where: {
        agentId: buyer.id
      },
      include: {
        vehicle: true,
        zone: true
      },
      orderBy: {
        checkInAt: "desc"
      }
    });

    return NextResponse.json(Array.isArray(bookings) ? bookings : []);
  } catch (error: any) {
    console.error("Buyer transactions fetch error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
