"use client";

import { useState } from "react";

interface AcceptOfferProps {
  isOpen: boolean;
  onClose: () => void;
  offer: any;
  onSuccess: () => void;
}

export default function AcceptOfferModal({ isOpen, onClose, offer, onSuccess }: AcceptOfferProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !offer) return null;

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      // 1. Update Offer Status
      // 2. Update Vehicle Status to 'sold'
      const res = await fetch(`/api/offers/${offer.id}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-none border-t-[12px] border-green-500 p-10 animate-scale-up shadow-2xl">
        <div className="text-center space-y-4 mb-10">
           <div className="w-16 h-16 bg-green-500 mx-auto flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-3xl">verified</span>
           </div>
           <h3 className="text-3xl font-black uppercase tracking-tighter">Seal the Deal</h3>
           <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
             Accepting KES {offer.amount.toLocaleString()} for {offer.vehicle?.regNumber}
           </p>
        </div>

        <div className="bg-zinc-50 p-6 border-2 border-dashed border-zinc-200 mb-10">
           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Legal Consequences</p>
           <p className="text-xs font-bold text-zinc-600 leading-relaxed italic">
             By clicking "Accept", you are marking this vehicle as SOLD. All other active offers will be automatically rejected. You will be prompted to generate an Exit Pass for the buyer.
           </p>
        </div>

        <div className="flex gap-4">
           <button 
            onClick={onClose}
            className="flex-1 py-4 border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-zinc-50 transition-all"
           >
            Decline
           </button>
           <button 
            disabled={isSubmitting}
            onClick={handleAccept}
            className="flex-2 bg-green-500 text-white px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all shadow-[0_10px_30px_rgba(34,197,94,0.3)] disabled:opacity-50"
           >
            {isSubmitting ? "Finalizing..." : "Accept & Mark Sold"}
           </button>
        </div>
      </div>
    </div>
  );
}
