import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [expected, actual, byMethod, settings] = await Promise.all([
      prisma.booking.aggregate({ 
        where: { paymentStatus: "paid" },
        _count: { id: true }
      }),
      prisma.transaction.aggregate({ _sum: { amount: true } }),
      prisma.transaction.groupBy({
        by: ['method'],
        _sum: { amount: true }
      }),
      prisma.systemSetting.findMany({
        where: {
          key: { in: ["mpesa_paybill", "mpesa_account_number"] }
        }
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
      })),
      paymentProtocol: {
        paybill: settings.find((s) => s.key === "mpesa_paybill")?.value || "",
        accountNumber: settings.find((s) => s.key === "mpesa_account_number")?.value || ""
      }
    });
  } catch (error) {
    console.error("Finance recon error:", error);
    return NextResponse.json({ error: "Failed to fetch finance data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const paybill = String(body.paybill || "").trim();
    const accountNumber = String(body.accountNumber || "").trim();

    if (!paybill || !accountNumber) {
      return NextResponse.json(
        { error: "Paybill and account number are required" },
        { status: 400 }
      );
    }

    await Promise.all([
      prisma.systemSetting.upsert({
        where: { key: "mpesa_paybill" },
        update: { value: paybill, description: "Admin-managed Paybill number for M-Pesa payments" },
        create: { key: "mpesa_paybill", value: paybill, description: "Admin-managed Paybill number for M-Pesa payments" }
      }),
      prisma.systemSetting.upsert({
        where: { key: "mpesa_account_number" },
        update: { value: accountNumber, description: "Admin-managed M-Pesa account number" },
        create: { key: "mpesa_account_number", value: accountNumber, description: "Admin-managed M-Pesa account number" }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Finance settings save error:", error);
    return NextResponse.json({ error: "Failed to save finance settings" }, { status: 500 });
  }
}
