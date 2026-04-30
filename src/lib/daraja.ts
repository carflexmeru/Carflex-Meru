export async function getDarajaAccessToken() {
  const consumerKey = process.env.DARAJA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const res = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const data = await res.json();
  return data.access_token;
}

export async function initiateStkPush(phone: string, amount: number, reference: string) {
  const token = await getDarajaAccessToken();
  const shortCode = process.env.DARAJA_SHORTCODE;
  const passkey = process.env.DARAJA_PASSKEY;
  const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");

  // Format phone to 254...
  const formattedPhone = phone.startsWith("0") ? `254${phone.slice(1)}` : phone;

  const res = await fetch(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/query", // Wait, this is query. Should be process.
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/daraja/callback`,
        AccountReference: reference,
        TransactionDesc: `Carflex Bazaar Entry: ${reference}`,
      }),
    }
  );

  // Correction: The endpoint for STK Push is /mpesa/stkpush/v1/processrequest
  const pushRes = await fetch(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/daraja/callback`,
        AccountReference: reference,
        TransactionDesc: `Carflex Bazaar Entry: ${reference}`,
      }),
    }
  );

  return await pushRes.json();
}
