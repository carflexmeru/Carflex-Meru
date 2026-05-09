"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Ticket {
  ticketId: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  ownerName: string;
  ownerPhone: string;
  ownerIdNumber: string;
  amountPaid: number;
  zoneName: string;
  qrCodeUrl: string;
  printUrl: string;
}

export default function TicketPage({
  params
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState("");
  const [editingPrice, setEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState<string>("");

  useEffect(() => {
    async function fetchTicket() {
      try {
        setLoading(true);
        // Using generate-ticket API to get data (it handles retrieval if already exists or creates new)
        // Wait, I should probably have a GET API for tickets.
        // For now, I'll use the ticketId to find the ticket record.
        const res = await fetch(`/api/vehicles/ticket/${ticketId}`);
        const data = await res.json();

        if (data.success) {
          setTicket(data.ticket);
          setNewPrice(data.ticket.amountPaid?.toString() || "0");
        } else {
          setError(data.error || "Ticket not found");
        }
      } catch (err) {
        setError("Error loading ticket");
      } finally {
        setLoading(false);
      }
    }

    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const handleUpdatePrice = async () => {
    if (!ticket || !newPrice) return;

    try {
      const res = await fetch(`/api/vehicles/ticket/${ticketId}/update-price`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaid: parseFloat(newPrice) })
      });

      const data = await res.json();

      if (data.success) {
        setTicket({ ...ticket, amountPaid: parseFloat(newPrice) });
        setEditingPrice(false);
        setError("");
      } else {
        setError(data.error || "Failed to update price");
      }
    } catch (err) {
      setError("Error updating price");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">Loading Ticket...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full nm-card p-8 space-y-6 border border-primary/20">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-primary text-3xl">error</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter">Error</h2>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Unable to load ticket</p>
          </div>
          <div className="nm-inset p-4 bg-primary/5 border border-primary/20 rounded">
            <p className="text-[10px] text-zinc-400 break-words whitespace-normal leading-relaxed">
              {error || "Ticket not found"}
            </p>
          </div>
          <button
            onClick={() => router.push("/gate/check-in")}
            className="nm-card w-full px-8 py-4 text-primary font-black uppercase text-xs hover:bg-primary/5 transition-all"
          >
            BACK TO CHECK-IN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 md:p-12 flex flex-col items-center font-mono">
      {/* Action Bar (Not printed) */}
      <div className="max-w-[1000px] w-full flex justify-between items-center mb-6 print:hidden">
        <button
          onClick={() => router.push("/gate/check-in")}
          className="flex items-center gap-2 text-zinc-500 hover:text-primary font-black uppercase text-[10px] tracking-widest"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Check-In
        </button>
        
        <div className="flex gap-4">
          {editingPrice ? (
            <div className="flex items-center gap-2 nm-inset p-1 px-3 bg-white border border-primary/20 rounded-full">
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="bg-transparent border-none text-primary font-black text-xs w-20 text-right focus:ring-0"
              />
              <button onClick={handleUpdatePrice} className="text-primary hover:scale-110"><span className="material-symbols-outlined text-sm font-black">check</span></button>
              <button onClick={() => setEditingPrice(false)} className="text-zinc-400 hover:scale-110"><span className="material-symbols-outlined text-sm font-black">close</span></button>
            </div>
          ) : (
            <button 
              onClick={() => setEditingPrice(true)}
              className="nm-card px-4 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-primary"
            >
              Adjust Price
            </button>
          )}
          <button 
            onClick={() => window.print()}
            className="nm-card px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(230,0,0,0.2)] border-none"
          >
            Print Ticket
          </button>
        </div>
      </div>

      {/* Main Ticket Container */}
      <div className="ticket-container w-full max-w-[1000px] bg-white border-[3px] border-[#E60000] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.1)] print:shadow-none print:max-w-none print:w-full print:h-screen print:flex print:flex-col print:justify-center">
        
        {/* Header */}
        <div className="header text-center mb-8 border-b-2 border-[#E60000] pb-6">
          <h1 className="text-4xl font-black tracking-[4px] text-black mb-1">CARFLEX</h1>
          <p className="text-sm font-black tracking-[2px] text-[#666] uppercase">Verification Ticket</p>
        </div>

        {/* Ticket Body */}
        <div className="ticket-body flex flex-col md:flex-row gap-10 items-start">
          
          {/* QR Section */}
          <div className="qr-section flex-shrink-0 w-full md:w-[300px] text-center p-6 bg-[#f9f9f9] border border-[#ddd]">
            <div className="relative w-[260px] h-[260px] mx-auto bg-white p-2 border border-[#eee]">
              <Image
                src={ticket.qrCodeUrl}
                alt="QR Code"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <p className="text-[10px] font-black mt-4 uppercase text-[#666] tracking-wider leading-relaxed">
              Scan for immediate <br/> verification
            </p>
          </div>

          {/* Details Section */}
          <div className="details flex-1 w-full space-y-1">
            <div className="text-3xl font-black text-[#E60000] mb-6 tracking-tighter">
              {ticket.ticketId}
            </div>

            <div className="detail-row flex justify-between py-3 border-b border-[#eee] text-base">
              <span className="font-black uppercase text-[#333] w-2/5">Registration:</span>
              <span className="text-right font-black text-black">{ticket.regNumber}</span>
            </div>

            <div className="detail-row flex justify-between py-3 border-b border-[#eee] text-base">
              <span className="font-black uppercase text-[#333] w-2/5">Vehicle:</span>
              <span className="text-right font-black text-black">
                {ticket.year} {ticket.make} {ticket.model}
              </span>
            </div>

            <div className="detail-row flex justify-between py-3 border-b border-[#eee] text-base">
              <span className="font-black uppercase text-[#333] w-2/5">Owner Name:</span>
              <span className="text-right font-black text-black">{ticket.ownerName}</span>
            </div>

            <div className="detail-row flex justify-between py-3 border-b border-[#eee] text-base">
              <span className="font-black uppercase text-[#333] w-2/5">ID Number:</span>
              <span className="text-right font-black text-black">{ticket.ownerIdNumber || "N/A"}</span>
            </div>

            <div className="detail-row flex justify-between py-3 border-b border-[#eee] text-base">
              <span className="font-black uppercase text-[#333] w-2/5">Phone:</span>
              <span className="text-right font-black text-black">{ticket.ownerPhone || "N/A"}</span>
            </div>

            <div className="detail-row flex justify-between py-3 border-b border-[#eee] text-base">
              <span className="font-black uppercase text-[#333] w-2/5">Market Zone:</span>
              <span className="text-right font-black text-[#E60000]">{ticket.zoneName}</span>
            </div>

            <div className="detail-row flex justify-between mt-6 bg-[#E60000]/5 -mx-3 px-3 py-4 text-lg font-black border-2 border-[#E60000]/10">
              <span className="uppercase text-[#333]">Amount Paid:</span>
              <span className="text-[#E60000] text-xl">KSH {ticket.amountPaid?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="footer text-center mt-10 pt-6 border-t-2 border-[#E60000]">
          <p className="text-[11px] font-black text-[#666] tracking-wider uppercase mb-2">
            Valid for Single Entry • Non-Transferable • Carflex Ground Operations
          </p>
          <div className="text-[10px] font-bold text-[#999] uppercase tracking-widest">
            Generated: {new Date().toLocaleString('en-US', { 
              month: 'numeric', 
              day: 'numeric', 
              year: 'numeric', 
              hour: 'numeric', 
              minute: '2-digit', 
              second: '2-digit', 
              hour12: true 
            })}
          </div>
        </div>
      </div>
      
      <p className="mt-12 text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] text-center print:hidden">
        Meru Showground 2024 • Ops Protocol v2.4
      </p>
    </div>
  );
}
