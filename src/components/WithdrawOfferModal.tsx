"use client";

import { useState } from "react";

interface WithdrawOfferProps {
  isOpen: boolean;
  onClose: () => void;
  offerId: string;
  onSuccess: () => void;
}

export default function WithdrawOfferModal({ isOpen, onClose, offerId, onSuccess }: WithdrawOfferProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleWithdraw = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/offers/${offerId}/withdraw`, {
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
      
      <div className="relative bg-white w-full max-w-md rounded-none border-t-[12px] border-black p-10 animate-scale-up shadow-2xl text-center">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Withdraw Offer?</h3>
        <p className="text-zinc-500 font-bold text-sm leading-relaxed mb-10 italic">
          Are you sure you want to retract your proposal? This will end the active negotiation for this asset.
        </p>

        <div className="flex gap-4">
           <button 
            onClick={onClose}
            className="flex-1 py-4 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-zinc-800 transition-all"
           >
            Stay & Bargain
           </button>
           <button 
            disabled={isSubmitting}
            onClick={handleWithdraw}
            className="flex-1 border-2 border-zinc-200 text-zinc-400 px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:border-primary hover:text-primary transition-all disabled:opacity-50"
           >
            {isSubmitting ? "Retracting..." : "Withdraw Offer"}
           </button>
        </div>
      </div>
    </div>
  );
}
