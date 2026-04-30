"use client";

import { useState } from "react";

interface EmergencyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: EmergencyProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Logic to save system broadcast
    setTimeout(() => {
      alert("GLOBAL BROADCAST SENT");
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-red-600/50 backdrop-blur-md"></div>
      
      <form onSubmit={handleBroadcast} className="relative bg-[#0A0A0A] text-white w-full max-w-lg rounded-none border-[12px] border-primary p-12 animate-scale-up shadow-2xl">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">Global <span className="text-primary">Emergency</span></h2>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-10">Bazaar-Wide Communication Hub</p>

        <div className="space-y-8">
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Broadcast Message</label>
              <textarea
                required
                rows={4}
                placeholder="e.g. BAZAAR GATE CLOSING IN 30 MINUTES..."
                className="w-full bg-white/5 border-2 border-white/10 p-6 font-bold text-xl outline-none focus:border-primary transition-all uppercase"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
           </div>
           
           <div className="pt-4 flex gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 border-2 border-white/10 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting}
                className="flex-2 bg-primary text-white px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all shadow-[0_10px_30px_rgba(230,0,0,0.3)]"
              >
                {isSubmitting ? "Broadcasting..." : "Send Global Alert"}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
