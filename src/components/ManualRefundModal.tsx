"use client";

import { useState } from "react";

interface RefundProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
}

export default function ManualRefundModal({ isOpen, onClose, transaction }: RefundProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !transaction) return null;

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock refund logic
    setTimeout(() => {
      alert(`REFUND PROCESSED: KES ${transaction.amount}`);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <form onSubmit={handleRefund} className="relative bg-white w-full max-w-md rounded-none border-t-[12px] border-black p-12 animate-scale-up shadow-2xl">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Manual Refund</h3>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-10">Reversing Transaction {transaction.reference}</p>

        <div className="space-y-8">
           <div className="flex justify-between items-center py-4 border-b border-zinc-100">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Refund Amount</span>
              <span className="text-xl font-bold">KES {transaction.amount.toLocaleString()}</span>
           </div>

           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Reason for Refund</label>
              <textarea
                required
                placeholder="e.g. DUPLICATE PAYMENT"
                className="w-full bg-zinc-50 border-2 border-zinc-100 p-4 font-bold outline-none focus:border-black uppercase"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
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
                className="flex-2 bg-primary text-white px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Confirm Refund"}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
