import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    
    console.log("Fetching ticket:", ticketId);
    
    const ticket = await prisma.registrationTicket.findUnique({
      where: { ticketId }
    });

    console.log("Ticket found:", ticket ? "yes" : "no");

    if (!ticket) {
      console.log("Ticket not found for ID:", ticketId);
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Generate HTML for printing
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Registration Ticket - ${ticket.ticketId}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Courier New', monospace;
            background: #f5f5f5;
            padding: 20px;
          }
          .ticket-container {
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border: 3px solid #E60000;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          }
          .ticket-body {
            display: flex;
            gap: 40px;
            align-items: flex-start;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #E60000;
            padding-bottom: 20px;
          }
          .header h1 {
            font-size: 32px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 4px;
            color: #000;
            margin-bottom: 5px;
          }
          .header p {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: #666;
          }
          .qr-section {
            flex: 0 0 300px;
            text-align: center;
            padding: 20px;
            background: #f9f9f9;
            border: 1px solid #ddd;
          }
          .qr-section img {
            width: 100%;
            max-width: 260px;
            height: auto;
          }
          .details {
            flex: 1;
          }
          .ticket-id-badge {
            font-size: 28px;
            font-weight: 900;
            color: #E60000;
            margin-bottom: 20px;
            font-family: monospace;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
            font-size: 16px;
          }
          .detail-label {
            font-weight: 900;
            text-transform: uppercase;
            color: #333;
            width: 40%;
          }
          .detail-value {
            text-align: right;
            color: #000;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #E60000;
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .timestamp {
            font-size: 12px;
            color: #999;
            margin-top: 10px;
          }
          @media print {
            @page {
              size: landscape;
              margin: 0;
            }
            body {
              padding: 0;
              background: white;
            }
            .ticket-container {
              box-shadow: none;
              border-width: 5px;
              max-width: 100%;
              width: 100%;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
          }
        </style>
      </head>
      <body>
        <div class="ticket-container">
          <div class="header">
            <h1>CARFLEX</h1>
            <p>Verification Ticket</p>
          </div>

          <div class="ticket-body">
            <div class="qr-section">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket.qrData)}" alt="QR Code">
              <p style="font-size: 10px; margin-top: 15px; text-transform: uppercase; color: #666;">Scan for immediate verification</p>
            </div>

            <div class="details">
              <div class="ticket-id-badge">${ticket.ticketId}</div>
              
              <div class="detail-row">
                <span class="detail-label">Registration:</span>
                <span class="detail-value">${ticket.regNumber}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Vehicle:</span>
                <span class="detail-value">${ticket.year} ${ticket.make} ${ticket.model}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Owner Name:</span>
                <span class="detail-value">${ticket.ownerName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">ID Number:</span>
                <span class="detail-value">${ticket.ownerIdNumber || "N/A"}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${ticket.ownerPhone}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Market Zone:</span>
                <span class="detail-value" style="color: #E60000;">${ticket.zoneName}</span>
              </div>
              <div class="detail-row" style="background: rgba(230, 0, 0, 0.05); margin: 0 -12px; padding: 12px 12px; font-size: 18px; font-weight: 900;">
                <span class="detail-label">Amount Paid:</span>
                <span class="detail-value" style="color: #E60000; font-size: 20px;">KSH ${(ticket.amountPaid || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Valid for Single Entry • Non-Transferable • Carflex Ground Operations</p>
            <div class="timestamp">
              Generated: ${new Date(ticket.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    console.log("HTML generated successfully, length:", html.length);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="ticket-${ticket.ticketId}.html"`
      }
    });
  } catch (error) {
    console.error("Print ticket error:", error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      return NextResponse.json({ 
        error: error.message,
        details: "Check server logs for more information"
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: String(error)
    }, { status: 500 });
  }
}
