import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/health — confirms DB is connected and returns table counts
export async function GET() {
  try {
    const [profiles, vehicles, zones, transactions] = await Promise.all([
      prisma.profile.count(),
      prisma.vehicle.count(),
      prisma.zone.count(),
      prisma.transaction.count(),
    ]);

    return NextResponse.json({
      status: "ok",
      database: "SQLite (local)",
      tables: { profiles, vehicles, zones, transactions },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: String(error) },
      { status: 500 }
    );
  }
}
