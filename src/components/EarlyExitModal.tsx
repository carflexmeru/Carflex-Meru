"use client";

import { useState } from "react";

interface EarlyExitProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any;
  onSuccess: () => void;
}

export default function EarlyExitModal({ isOpen, onClose, vehicle, onSuccess }: EarlyExitProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handleExit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Logic to request an exit pass for early exit
      const res = await fetch("/api/gate/early-exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId: vehicle.id, reason }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <form onSubmit={handleExit} className="relative bg-white w-full max-w-md rounded-none border-t-[12px] border-zinc-400 p-10 animate-scale-up shadow-2xl">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Early Exit</h3>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-8">Leaving the Meru Showground bazaar early?</p>

        <div className="space-y-6">
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Primary Reason</label>
              <select 
                required
                className="w-full bg-zinc-50 border-2 border-zinc-100 p-4 font-bold outline-none focus:border-black"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="">Select Reason</option>
                <option value="emergency">Family Emergency</option>
                <option value="not_selling">No Buyer Interest</option>
                <option value="technical">Vehicle Technical Issue</option>
                <option value="other">Other Operational Reason</option>
              </select>
           </div>
           
           <div className="pt-4 flex gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-zinc-50 transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting}
                className="flex-2 bg-black text-white px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Request Exit Pass"}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
