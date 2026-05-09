"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Ticket = {
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
  eventName?: string;
  paymentMethod?: string;
  qrCodeUrl: string;
  printUrl: string;
};

const displayText = (value?: string | null) => (value && value.trim() ? value.trim() : "");
const displayYear = (value?: number | null) => (value && value > 0 ? String(value) : "");

export default function StaffTicketScanner({ title }: { title: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [scanText, setScanText] = useState("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loadingTicket, setLoadingTicket] = useState(false);

  const ticketId = useMemo(() => {
    if (!scanText) return "";
    try {
      const parsed = JSON.parse(scanText);
      if (typeof parsed?.ticketId === "string") return parsed.ticketId;
      if (typeof parsed?.url === "string") {
        const match = parsed.url.match(/\/gate\/ticket\/([^/?#]+)/);
        return match?.[1] || "";
      }
    } catch {}

    const urlMatch = scanText.match(/\/gate\/ticket\/([^/?#]+)/);
    if (urlMatch?.[1]) return urlMatch[1];

    const directMatch = scanText.match(/CFX-\d+/i);
    return directMatch?.[0] || "";
  }, [scanText]);

  const stopScanner = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const loadTicket = async (id: string) => {
    if (!id) return;
    setLoadingTicket(true);
    setTicket(null);
    try {
      const res = await fetch(`/api/vehicles/ticket/${id}`);
      const data = await res.json();
      if (data.success) setTicket(data.ticket);
      else setCameraError(data.error || "Ticket not found");
    } catch {
      setCameraError("Unable to load ticket details");
    } finally {
      setLoadingTicket(false);
    }
  };

  useEffect(() => {
    if (ticketId) loadTicket(ticketId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  useEffect(() => {
    void startScanner();
    return () => stopScanner();
  }, []);

  const startScanner = async () => {
    setCameraError("");
    setScanText("");
    setTicket(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setScanning(true);

      const Detector = (window as Window & { BarcodeDetector?: new (options: { formats: string[] }) => { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>> } }).BarcodeDetector;
      const detector = Detector ? new Detector({ formats: ["qr_code"] }) : null;
      const loop = async () => {
        const video = videoRef.current;
        if (!video || video.readyState < 2) {
          rafRef.current = requestAnimationFrame(loop);
          return;
        }

        if (detector) {
          try {
            const codes = await detector.detect(video);
            if (codes.length > 0) {
              const value = codes[0].rawValue;
              setScanText(value);
              stopScanner();
              return;
            }
          } catch (err) {
            console.error("Scan error:", err);
          }
        }

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    } catch (err) {
      setCameraError("Camera access is required. Use the manual ticket ID field if needed.");
    }
  };

  const handleManualLookup = async () => {
    if (!scanText.trim()) return;
    const id = ticketId || scanText.trim();
    await loadTicket(id);
  };

  const downloadTicket = async () => {
    if (!ticket) return;
    const response = await fetch(ticket.printUrl);
    const html = await response.text();
    const blob = new Blob([html], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ticket-${ticket.ticketId}.html`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-[2.7rem] sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.88] text-foreground">
          {title} <br /> <span className="text-stroke italic">SCANNER.</span>
        </h1>
        <p className="max-w-[36ch] text-zinc-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px] leading-relaxed">
          Scan a QR code or enter a ticket ID to view and verify ticket details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="nm-card p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">qr_code_scanner</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Camera Scanner</span>
            </div>
            <div className="flex gap-2">
              <button onClick={startScanner} className="nm-card px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:text-primary">
                Start Scan
              </button>
              <button onClick={stopScanner} className="nm-card px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:text-primary">
                Stop
              </button>
            </div>
          </div>

          <div className="nm-inset overflow-hidden bg-black/10 border border-white/5">
            <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-[4/3] object-cover bg-black" />
          </div>

          {cameraError && (
            <div className="nm-inset p-4 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20">
              {cameraError}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Manual Ticket ID or QR Text</label>
            <div className="nm-inset p-2 flex gap-2">
              <input
                value={scanText}
                onChange={(e) => setScanText(e.target.value)}
                placeholder="Paste ticket ID or QR payload"
                className="w-full bg-transparent px-3 py-3 text-sm font-bold outline-none border-none"
              />
              <button onClick={handleManualLookup} className="nm-card px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:text-primary">
                Lookup
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="nm-card p-6 sm:p-8 space-y-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Scan Result</p>
            {!scanText && !loadingTicket ? (
              <div className="nm-inset p-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                Waiting for a scan...
              </div>
            ) : loadingTicket ? (
              <div className="nm-inset p-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                Loading ticket details...
              </div>
            ) : ticket ? (
              <div className="space-y-4">
                <div className="nm-inset p-4 space-y-3">
                  <div className="flex justify-between gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Ticket</span>
                    <span className="font-mono text-primary font-black">{ticket.ticketId}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Plate</span>
                    <span className="font-black uppercase">{ticket.regNumber}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Owner</span>
                    <span className="font-black uppercase">{ticket.ownerName}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Zone</span>
                    <span className="font-black uppercase text-primary">{displayText(ticket.zoneName)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Event</span>
                    <span className="font-black uppercase">{displayText(ticket.eventName)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Amount</span>
                    <span className="font-black uppercase text-primary">KSH {ticket.amountPaid?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Vehicle</span>
                    <span className="font-black uppercase">
                      {[displayYear(ticket.year), displayText(ticket.make), displayText(ticket.model)].filter(Boolean).join(" ")}
                    </span>
                  </div>
                </div>

                <div className="nm-inset p-4 bg-white flex justify-center">
                  <Image src={ticket.qrCodeUrl} alt={ticket.ticketId} width={180} height={180} unoptimized />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link href={`/gate/ticket/${ticket.ticketId}`} className="nm-card px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:text-primary text-center">
                    Open Ticket
                  </Link>
                  <button onClick={downloadTicket} className="nm-card px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:text-primary">
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="nm-inset p-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                Scan a QR code to load ticket details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
