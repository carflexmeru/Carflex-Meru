import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json([], { status: 200 });
    }

    // 1. Resolve Profile First
    const vendor = await prisma.profile.findUnique({ 
       where: { phone } 
    });
    
    if (!vendor) {
       return NextResponse.json([], { status: 200 });
    }

    // 2. Fetch messages with resilient relation handling
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { receiverId: vendor.id },
          { senderId: vendor.id }
        ]
      },
      include: {
        sender: true,
        receiver: true,
        vehicle: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(Array.isArray(messages) ? messages : []);
  } catch (error: any) {
    console.error("Vendor messages fetch error:", error);
    // CRITICAL: Always return array to prevent frontend crash
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const { senderPhone, receiverId, content, vehicleId } = await request.json();

    if (!senderPhone || !receiverId || !content) {
       return NextResponse.json({ error: "PAYLOAD_INCOMPLETE" }, { status: 400 });
    }

    const sender = await prisma.profile.findUnique({ where: { phone: senderPhone } });
    if (!sender) return NextResponse.json({ error: "SENDER_IDENTITY_NOT_FOUND" }, { status: 404 });

    const message = await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId,
        content,
        vehicleId: vehicleId || undefined
      }
    });

    return NextResponse.json(message);
  } catch (error: any) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "TRANSMISSION_FAILURE" }, { status: 500 });
  }
}
