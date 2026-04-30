import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { vehicleId, buyerPhone, amount, message } = await request.json();

    if (!vehicleId || !buyerPhone || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Ensure Buyer Profile Exists
    let buyer = await prisma.profile.findUnique({ where: { phone: buyerPhone } });
    if (!buyer) {
      buyer = await prisma.profile.create({
        data: {
          phone: buyerPhone,
          role: "buyer",
        }
      });
    }

    // 2. Create Offer & First Message
    const offer = await prisma.offer.create({
      data: {
        vehicleId,
        buyerId: buyer.id,
        amount: parseFloat(amount),
        status: "pending",
        messages: {
          create: {
            senderId: buyer.id,
            content: message || `I am interested in this vehicle and would like to offer KES ${amount}.`,
          }
        }
      },
      include: {
        messages: true,
      }
    });

    return NextResponse.json({ success: true, data: offer });
  } catch (error) {
    console.error("Offer creation error:", error);
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}
