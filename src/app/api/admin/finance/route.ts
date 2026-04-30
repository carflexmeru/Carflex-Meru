import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [expected, actual, byMethod] = await Promise.all([
      prisma.booking.aggregate({ 
        where: { paymentStatus: "paid" },
        _count: { id: true }
      }),
      prisma.transaction.aggregate({ _sum: { amount: true } }),
      prisma.transaction.groupBy({
        by: ['method'],
        _sum: { amount: true }
      })
    ]);

    // Since SQLite/Prisma pricing mapping in aggregation is complex, 
    // let's do a manual sum for "Expected" based on paid bookings and their zone prices.
    const paidBookings = await prisma.booking.findMany({
      where: { paymentStatus: "paid" },
      include: { zone: true }
    });
    
    const expectedRevenue = paidBookings.reduce((acc, curr) => acc + (curr.zone?.price || 0), 0);

    return NextResponse.json({
      expected: expectedRevenue,
      actual: actual._sum.amount || 0,
      breakdown: byMethod.map(b => ({
        method: b.method,
        amount: b._sum.amount || 0
      }))
    });
  } catch (error) {
    console.error("Finance recon error:", error);
    return NextResponse.json({ error: "Failed to fetch finance data" }, { status: 500 });
  }
}
