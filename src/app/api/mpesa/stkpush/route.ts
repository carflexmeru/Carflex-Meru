import { NextResponse } from "next/server";

/**
 * Carflex M-Pesa (Daraja) Integration
 * Logic for triggering STK Push to vendors at the gate.
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plate, phone, amount, idNumber } = body;

    if (!plate || !phone || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. In a real scenario, we'd fetch the Access Token from Daraja
    // const token = await getMpesaToken();

    // 2. Prepare STK Push payload
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
    // const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString("base64");

    console.log(`[DARJA] Triggering STK Push for ${plate} - KES ${amount} to ${phone}`);

    // 3. Mock Safaricom Response
    const mockSafaricomResponse = {
      MerchantRequestID: "29115-34620561-1",
      CheckoutRequestID: "ws_CO_19122023102030405",
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing",
      CustomerMessage: "Success. Request accepted for processing",
    };

    // 4. Log to Audit Trails (Mock)
    // await supabase.from('audit_logs').insert({ ... })

    return NextResponse.json(mockSafaricomResponse);
  } catch (error) {
    console.error("[MPESA_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Helper for Token (Skeleton)
async function getMpesaToken() {
  const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
  
  const res = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers: { Authorization: `Basic ${auth}` },
  });
  
  const data = await res.json();
  return data.access_token;
}
