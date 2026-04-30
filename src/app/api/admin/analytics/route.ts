import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalVehicles,
      activeBargains,
      totalRevenue,
      totalViews,
      totalUsers,
      totalAuditLogs
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.offer.count({ where: { status: "pending" } }),
      prisma.transaction.aggregate({ _sum: { amount: true } }),
      prisma.vehicleView.count(),
      prisma.profile.count(),
      prisma.auditLog.count()
    ]);

    return NextResponse.json({
      metrics: {
        inventory: totalVehicles,
        negotiations: activeBargains,
        revenue: totalRevenue._sum.amount || 0,
        traffic: totalViews,
        users: totalUsers,
        securityEvents: totalAuditLogs
      }
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch admin metrics" }, { status: 500 });
  }
}
