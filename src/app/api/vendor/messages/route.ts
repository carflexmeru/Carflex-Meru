import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Missing identity node." }, { status: 400 });
    }

    const vendor = await prisma.profile.findUnique({ where: { phone } });
    if (!vendor) return NextResponse.json({ error: "Vendor not found." }, { status: 404 });

    // 1. Fetch conversations (Unique senders)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { receiverId: vendor.id },
          { senderId: vendor.id }
        ]
      },
      include: {
        sender: true,
        receiver: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("Vendor messages fetch error:", error);
    return NextResponse.json({ error: "FAILED_TO_SYNC_COMMUNICATIONS" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { senderPhone, receiverId, content, vehicleId } = await request.json();

    const sender = await prisma.profile.findUnique({ where: { phone: senderPhone } });
    if (!sender) return NextResponse.json({ error: "Sender not found." }, { status: 404 });

    const message = await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId,
        content,
        vehicleId
      }
    });

    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
