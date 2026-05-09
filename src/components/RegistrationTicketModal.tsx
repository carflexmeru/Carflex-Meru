"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";

interface RegistrationTicketModalProps {
  isOpen: boolean;
  vehicleId: string | null;
  vehicleInfo?: {
    regNumber: string;
    make: string;
    model: string;
    year: number;
  } | null;
  onClose: () => void;
  autoGenerate?: boolean;
}

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

export default function RegistrationTicketModal({
  isOpen,
  vehicleId,
  vehicleInfo,
  onClose,
  autoGenerate = false
}: RegistrationTicketModalProps) {
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState("");
  const hasGenerated = useRef<string | null>(null);
  const [editingPrice, setEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState<string>("");

  const handleGenerateTicket = useCallback(async () => {
    if (!vehicleId) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/vehicles/generate-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId })
      });

      const data = await res.json();

      if (data.success) {
        setTicket(data.ticket);
        setNewPrice(data.ticket.amountPaid?.toString() || "0");
      } else {
        setError(data.error || "Failed to generate ticket");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating ticket");
    } finally {
      setLoading(false);
    }
  }, [vehicleId]);

  useEffect(() => {
    if (isOpen && autoGenerate && vehicleId && hasGenerated.current !== vehicleId) {
      hasGenerated.current = vehicleId;
      handleGenerateTicket();
    }
    
    // Reset ref when modal closes to allow re-generation if reopened for same/different ID
    if (!isOpen) {
      hasGenerated.current = null;
    }
  }, [isOpen, autoGenerate, vehicleId, handleGenerateTicket]);

  const handleUpdatePrice = async () => {
    if (!ticket || !newPrice) return;

    try {
      const res = await fetch(`/api/vehicles/ticket/${ticket.ticketId}/update-price`, {
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

  const handleDownloadQR = async () => {
    if (!ticket) return;

    try {
      const response = await fetch(ticket.qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qr-${ticket.ticketId}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download QR error:", err);
    }
  };

  const handleDownloadTicket = async () => {
    if (!ticket) return;

    try {
      // Fetch the HTML ticket
      const response = await fetch(ticket.printUrl);
      const html = await response.text();
      
      // Create a blob from the HTML
      const blob = new Blob([html], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket-${ticket.ticketId}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download ticket error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 md:p-4">
      <div className="nm-card max-w-2xl w-full max-h-[95vh] overflow-y-auto p-5 md:p-10 space-y-6 md:y-8 border border-primary/20 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none sticky top-0" />
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">confirmation_number</span>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-foreground">
                Registration Ticket
              </h2>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                Generate & Download Your Verification Ticket
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {!ticket ? (
          <>
            {/* Vehicle Info */}
            {vehicleInfo && (
              <div className="nm-inset p-6 space-y-4">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Vehicle Details</p>
                <div className="space-y-4 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider">Registration:</span>
                    <span className="text-foreground font-black text-sm">{vehicleInfo.regNumber}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-foreground/5 pt-4">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider">Vehicle:</span>
                    <span className="text-foreground font-black">
                      {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="nm-inset bg-primary/10 p-4 border border-primary/30 rounded space-y-2">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-lg flex-shrink-0">warning</span>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Error</p>
                    <p className="text-[10px] text-zinc-300 break-words whitespace-normal">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleGenerateTicket}
                disabled={loading}
                className="flex-1 nm-card !bg-primary text-white py-5 font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all border-none shadow-[0_15px_30px_rgba(230,0,0,0.3)] disabled:opacity-50"
              >
                {loading ? "GENERATING..." : "GENERATE TICKET"}
              </button>
              <button
                onClick={onClose}
                className="flex-1 nm-card text-foreground py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-foreground/5 transition-all border-none"
              >
                CANCEL
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Ticket Generated */}
            <div className="nm-inset p-4 md:p-8 space-y-4 md:space-y-6 bg-primary/5 border border-primary/20">
              <div className="text-center space-y-1 md:space-y-2">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-primary text-lg md:text-xl">check_circle</span>
                </div>
                <p className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ticket Generated Successfully</p>
              </div>

              <div className="nm-inset p-4 md:p-6 space-y-1 md:space-y-2">
                <p className="text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-widest">Ticket Number</p>
                <p className="text-xl md:text-3xl font-black text-primary tracking-tighter font-mono break-all leading-none">
                  {ticket.ticketId}
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
                {/* QR Code Preview */}
                <div className="nm-inset p-3 md:p-4 bg-white flex-shrink-0">
                  <Image
                    src={ticket.qrCodeUrl}
                    alt="QR Code"
                    width={192}
                    height={192}
                    className="w-32 h-32 md:w-48 md:h-48"
                    unoptimized
                  />
                </div>

                <div className="flex-1 w-full space-y-3 md:space-y-4 text-[10px] md:text-[11px]">
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
                  <div className="flex justify-between items-center border-t border-primary/20 pt-3 bg-primary/5 -mx-4 md:-mx-8 px-4 md:px-8 py-3 mt-4">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider">Amount Paid:</span>
                    {editingPrice ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="bg-primary/20 border border-primary/40 rounded px-2 py-1 text-primary font-black text-sm w-24 text-right"
                          placeholder="0"
                        />
                        <button
                          onClick={handleUpdatePrice}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Save"
                        >
                          <span className="material-symbols-outlined text-xs">check</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingPrice(false);
                            setNewPrice(ticket.amountPaid?.toString() || "0");
                          }}
                          className="text-zinc-500 hover:text-zinc-400 transition-colors"
                          title="Cancel"
                        >
                          <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-black text-lg">KSH {ticket.amountPaid?.toLocaleString()}</span>
                        <button
                          onClick={() => setEditingPrice(true)}
                          className="text-zinc-500 hover:text-primary transition-colors"
                          title="Edit price"
                        >
                          <span className="material-symbols-outlined text-xs">edit</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Download & Print Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button
                onClick={handleDownloadQR}
                className="nm-card text-foreground py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-foreground/5 transition-all border-none flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Download QR
              </button>
              <button
                onClick={handleDownloadTicket}
                className="nm-card !bg-primary text-white py-5 font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all border-none shadow-[0_15px_30px_rgba(230,0,0,0.3)] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Download Ticket
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full nm-card text-zinc-500 hover:text-foreground py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-foreground/5 transition-all border-none"
            >
              CLOSE
            </button>
          </>
        )}
      </div>
    </div>
  );
}
