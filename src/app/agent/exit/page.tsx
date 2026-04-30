"use client";

import { useState } from "react";

export default function AgentExit() {
  const [qrHash, setQrHash] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; vehicle?: any } | null>(null);

  const handleExit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrHash) return;
    setIsProcessing(true);
    setResult(null);

    try {
      const res = await fetch("/api/gate/exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrHash }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) setQrHash("");
    } catch (error) {
      setResult({ success: false, message: "System Communication Error" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8 font-sans flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary mx-auto flex items-center justify-center rounded-none shadow-[0_0_50px_rgba(230,0,0,0.2)]">
            <span className="material-symbols-outlined text-4xl">output</span>
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Agent 3: Exit</h1>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1">Vehicle Release Control</p>
          </div>
        </div>

        {/* Scan/Input Interface */}
        <form onSubmit={handleExit} className="space-y-6">
          <div className="relative">
            <input
              required
              type="text"
              placeholder="SCAN QR OR ENTER HASH"
              className="w-full bg-white/5 border-2 border-white/10 p-6 text-xl font-black tracking-widest text-center uppercase outline-none focus:border-primary transition-all"
              value={qrHash}
              onChange={(e) => setQrHash(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
               <span className="material-symbols-outlined">qr_code_scanner</span>
            </div>
          </div>
          
          <button
            disabled={isProcessing}
            className="w-full bg-primary text-white py-6 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all shadow-[0_20px_50px_rgba(230,0,0,0.1)]"
          >
            {isProcessing ? "VALIDATING..." : "VALIDATE EXIT PASS"}
          </button>
        </form>

        {/* Feedback Section */}
        {result && (
          <div className={`p-8 border-4 animate-scale-up ${
            result.success ? 'border-green-500 bg-green-500/10' : 'border-primary bg-primary/10'
          }`}>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-3xl">
                {result.success ? 'verified' : 'warning'}
              </span>
              <div>
                <h3 className="text-xl font-black uppercase">{result.success ? 'Clear to Exit' : 'Access Denied'}</h3>
                <p className="text-sm font-bold opacity-70 mt-1">{result.message}</p>
                {result.vehicle && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Authorized Asset</p>
                    <p className="text-lg font-black">{result.vehicle.regNumber}</p>
                    <p className="text-xs font-bold text-zinc-500">{result.vehicle.make} {result.vehicle.model}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Security Alert */}
        <div className="bg-white/5 p-6 border border-white/5 flex gap-4 items-center">
          <span className="material-symbols-outlined text-primary text-sm">security</span>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 leading-relaxed">
            All exits are logged for audit. Ensure the vehicle physical plate matches the system record before raising the barrier.
          </p>
        </div>
      </div>
    </div>
  );
}
