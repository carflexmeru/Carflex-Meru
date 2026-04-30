import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "Phone number required" }, { status: 400 });
  }

  try {
    const user = await prisma.profile.findUnique({
      where: { phone },
      include: {
        _count: {
          select: {
            offers: true,
            vehicles: true,
          }
        },
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 5
        },
        auditLogs: {
          orderBy: { createdAt: "desc" },
          take: 5
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      stats: {
        offers: user._count.offers,
        vehicles: user._count.vehicles,
        saved: 0, // Placeholder for future bookmark table
      },
      transactions: user.transactions,
      activity: user.auditLogs.map(log => ({
        type: "System Event",
        desc: log.action,
        time: log.createdAt,
        status: "COMPLETE"
      }))
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
