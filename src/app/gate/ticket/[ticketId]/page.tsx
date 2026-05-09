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
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-primary">error</span>
        </div>
        <h2 className="text-xl font-black text-white uppercase mb-2">Error</h2>
        <p className="text-zinc-500 mb-6">{error || "Ticket not found"}</p>
        <button
          onClick={() => router.push("/gate/check-in")}
          className="nm-card px-8 py-4 text-primary font-black uppercase text-xs"
        >
          BACK TO CHECK-IN
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full nm-card p-6 md:p-10 space-y-8 border border-primary/20 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">confirmation_number</span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-foreground">
                Registration Ticket
              </h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                Verified Gate Access Pass
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/gate/check-in")}
            className="nm-card w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Ticket Content */}
        <div className="nm-inset p-6 md:p-8 space-y-6 bg-primary/5 border border-primary/20">
          <div className="nm-inset p-4 md:p-6 space-y-2">
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Ticket Number</p>
            <p className="text-3xl md:text-4xl font-black text-primary tracking-tighter font-mono break-all leading-none">
              {ticket.ticketId}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* QR Code */}
            <div className="nm-inset p-4 bg-white flex-shrink-0">
              <Image
                src={ticket.qrCodeUrl}
                alt="QR Code"
                width={200}
                height={200}
                className="w-48 h-48 md:w-56 md:h-56"
                unoptimized
              />
            </div>

            <div className="flex-1 w-full space-y-4 text-[11px] md:text-[13px]">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Registration:</span>
                <span className="text-foreground font-black">{ticket.regNumber}</span>
              </div>
              <div className="flex justify-between items-center border-t border-foreground/5 pt-3">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Vehicle:</span>
                <span className="text-foreground font-black">
                  {ticket.year} {ticket.make} {ticket.model}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-foreground/5 pt-3">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Owner:</span>
                <span className="text-foreground font-black">{ticket.ownerName}</span>
              </div>
              <div className="flex justify-between items-center border-t border-foreground/5 pt-3">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">ID Number:</span>
                <span className="text-foreground font-black">{ticket.ownerIdNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center border-t border-foreground/5 pt-3">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Phone:</span>
                <span className="text-foreground font-black">{ticket.ownerPhone || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center border-t border-foreground/5 pt-3">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Zone:</span>
                <span className="text-foreground font-black text-primary">{ticket.zoneName}</span>
              </div>
              <div className="flex justify-between items-center border-t border-primary/20 pt-4 bg-primary/5 -mx-6 md:-mx-8 px-6 md:px-8 py-4 mt-6">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Amount Paid:</span>
                <span className="text-primary font-black text-xl">KES {ticket.amountPaid?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <a
            href={ticket.printUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nm-card !bg-primary text-white py-6 font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all border-none shadow-[0_15px_30px_rgba(230,0,0,0.3)] flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            Download Ticket
          </a>
          <button
            onClick={() => router.push("/gate/check-in")}
            className="nm-card text-foreground py-6 font-black uppercase tracking-[0.2em] text-xs hover:bg-foreground/5 transition-all border-none flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            New Check-in
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center">
        Carflex Ground Operations • Meru Showground 2024
      </p>
    </div>
  );
}
