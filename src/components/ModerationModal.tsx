"use client";

import { useState } from "react";

interface ModerationProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any;
}

export default function ModerationModal({ isOpen, onClose, vehicle }: ModerationProps) {
  const [action, setAction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !vehicle) return null;

  const handleModerate = async () => {
    setIsSubmitting(true);
    // Mock moderation logic
    setTimeout(() => {
      alert(`VEHICLE ${vehicle.regNumber} STATUS UPDATED TO ${action}`);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-none border-t-[12px] border-black p-12 animate-scale-up shadow-2xl">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Asset Moderation</h3>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-10">Control Hub for {vehicle.regNumber}</p>

        <div className="space-y-6">
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Select Action</label>
              <select 
                required
                className="w-full bg-zinc-50 border-2 border-zinc-100 p-4 font-bold outline-none focus:border-black"
                value={action}
                onChange={(e) => setAction(e.target.value)}
              >
                <option value="">Choose Action...</option>
                <option value="suspended">Suspend Listing (TOS Violation)</option>
                <option value="featured">Mark as Featured Asset</option>
                <option value="draft">Revert to Draft (Missing Info)</option>
                <option value="archived">Force Archive</option>
              </select>
           </div>
           
           <div className="pt-4 flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-4 border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-zinc-50 transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting || !action}
                onClick={handleModerate}
                className="flex-2 bg-black text-white px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Applying..." : "Apply Action"}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
