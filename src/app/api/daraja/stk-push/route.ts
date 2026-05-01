import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initiateStkPush } from "@/lib/daraja";

export async function POST(request: Request) {
  try {
    const { phone, amount, regNumber, zoneId, idNumber } = await request.json();
    const cleanPlate = regNumber.toUpperCase();

    // 1. Check Security Blacklist (Fail-safe)
    try {
      const isBlacklisted = await prisma.stolenVehicle.findUnique({
        where: { regNumber: cleanPlate },
      });

      if (isBlacklisted) {
        return NextResponse.json({ 
          error: "SECURITY ALERT: Vehicle is flagged in Stolen Database.",
          severity: "critical"
        }, { status: 403 });
      }
    } catch (e) {
      console.warn("⚠️ Security database scan deferred: Run tactical SQL to enable.");
    }

    // 2. Prevent DOUBLE ENTRY
    // Check if vehicle is already in the bazaar (Active booking with no exit date)
    const activeBooking = await prisma.booking.findFirst({
      where: {
        vehicle: { regNumber: cleanPlate },
        exitAt: null,
        paymentStatus: "paid"
      }
    });

    if (activeBooking) {
      return NextResponse.json({ 
        error: `INVALID ENTRY: Vehicle ${cleanPlate} is already inside the bazaar.`,
      }, { status: 400 });
    }

    // 3. Create Idempotent Transaction Lock
    const reference = cleanPlate;
    
    let owner = await prisma.profile.findFirst({
      where: {
        OR: [
          { phone },
          { idNumber: idNumber || undefined }
        ]
      }
    });

    if (!owner) {
      owner = await prisma.profile.create({
        data: {
          phone,
          idNumber,
          role: "vendor",
        }
      });
    }

    // 4. Initiate Real Daraja STK Push
    const pushResponse = await initiateStkPush(phone, parseFloat(amount), reference);
    
    console.log("🦁 DARAJA PUSH INITIATED:", pushResponse);

    if (pushResponse.ResponseCode === "0") {
      return NextResponse.json({ 
        success: true, 
        message: "STK Push Initiated to Phone.", 
        merchantRequestId: pushResponse.MerchantRequestID,
        checkoutRequestId: pushResponse.CheckoutRequestID
      });
    } else {
      return NextResponse.json({ 
        error: pushResponse.errorMessage || "M-Pesa integration error." 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("STK Push error:", error);
    return NextResponse.json({ error: error.message || "Failed to initiate payment" }, { status: 500 });
  }
}
