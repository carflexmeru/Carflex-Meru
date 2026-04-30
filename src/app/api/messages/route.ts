import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { offerId, senderPhone, content } = await request.json();

    if (!offerId || !senderPhone || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Find Sender Profile
    const sender = await prisma.profile.findUnique({ where: { phone: senderPhone } });
    if (!sender) {
      return NextResponse.json({ error: "Sender profile not found" }, { status: 404 });
    }

    // 2. Create Message
    const message = await prisma.message.create({
      data: {
        offerId,
        senderId: sender.id,
        content,
      },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Message sending error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
