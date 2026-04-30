"use client";

import { useState } from "react";

interface PaymentOverrideProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onSuccess: () => void;
}

export default function PaymentOverrideModal({ isOpen, onClose, bookingId, onSuccess }: PaymentOverrideProps) {
  const [adminPin, setAdminPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Logic to manually override payment status
      const res = await fetch(`/api/gate/payment-override`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, adminPin }),
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
      
      <form onSubmit={handleOverride} className="relative bg-white w-full max-w-md rounded-none border-t-[12px] border-primary p-10 animate-scale-up shadow-2xl">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-primary">Payment Override</h3>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-8">Manual Reconciliation — Admin Only</p>

        <div className="bg-red-50 p-6 border-2 border-primary/20 mb-10">
           <p className="text-xs font-bold text-primary leading-relaxed italic">
             This action bypasses the Daraja STK Push and manually marks the booking as PAID. Only use this for verified cash payments.
           </p>
        </div>

        <div className="space-y-6">
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Admin Authorization PIN</label>
              <input
                required
                type="password"
                placeholder="****"
                className="w-full bg-zinc-50 border-2 border-zinc-100 p-5 text-center text-3xl font-black outline-none focus:border-primary"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
              />
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
                {isSubmitting ? "Overriding..." : "Authorize Payment"}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
