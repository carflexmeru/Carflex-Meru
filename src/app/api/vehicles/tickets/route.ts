import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const tickets = await prisma.registrationTicket.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        ticketId: true,
        regNumber: true,
        make: true,
        model: true,
        year: true,
        ownerName: true,
        ownerPhone: true,
        ownerIdNumber: true,
        zoneName: true,
        amountPaid: true,
        status: true,
        qrData: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      tickets
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
