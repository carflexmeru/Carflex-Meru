import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Try to fetch data, but return empty/default if tables don't exist
    let expectedRevenue = 0;
    let actualRevenue = 0;
    let breakdown = [];
    let paymentProtocol = { paybill: "", accountNumber: "" };

    try {
      const paidBookings = await prisma.booking.findMany({
        where: { paymentStatus: "paid" },
        include: { zone: true },
        take: 1000, // Limit to prevent timeout
      });
      
      expectedRevenue = paidBookings.reduce((acc, curr) => acc + (curr.zone?.price || 0), 0);
    } catch (e) {
      console.warn("Could not fetch bookings:", e);
    }

    try {
      const transactions = await prisma.transaction.aggregate({ 
        _sum: { amount: true } 
      });
      actualRevenue = transactions._sum.amount || 0;
    } catch (e) {
      console.warn("Could not fetch transactions:", e);
    }

    try {
      const byMethod = await prisma.transaction.groupBy({
        by: ['method'],
        _sum: { amount: true }
      });
      breakdown = byMethod.map(b => ({
        method: b.method,
        amount: b._sum.amount || 0
      }));
    } catch (e) {
      console.warn("Could not fetch transaction breakdown:", e);
    }

    try {
      const settings = await prisma.systemSetting.findMany({
        where: {
          key: { in: ["mpesa_paybill", "mpesa_account_number"] }
        }
      });
      paymentProtocol = {
        paybill: settings.find((s) => s.key === "mpesa_paybill")?.value || "",
        accountNumber: settings.find((s) => s.key === "mpesa_account_number")?.value || ""
      };
    } catch (e) {
      console.warn("Could not fetch settings:", e);
    }

    return NextResponse.json({
      expected: expectedRevenue,
      actual: actualRevenue,
      breakdown,
      paymentProtocol
    });
  } catch (error) {
    console.error("Finance recon error:", error);
    return NextResponse.json({ 
      expected: 0,
      actual: 0,
      breakdown: [],
      paymentProtocol: { paybill: "", accountNumber: "" }
    }, { status: 200 });
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

    try {
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
    } catch (e) {
      console.warn("Could not save settings:", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Finance settings save error:", error);
    return NextResponse.json({ error: "Failed to save finance settings" }, { status: 500 });
  }
}
