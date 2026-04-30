"use client";

interface TransactionDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    amount: number;
    method: string;
    reference: string;
    createdAt: string;
  } | null;
}

export default function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsProps) {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-none border-[10px] border-black p-10 animate-scale-up shadow-2xl">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter">Receipt Detail</h3>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Immutable Ledger Entry</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-black">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-8 font-mono">
          <div className="flex justify-between border-b border-zinc-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Transaction ID</span>
            <span className="text-sm font-bold">{transaction.id}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">M-Pesa Reference</span>
            <span className="text-sm font-bold text-primary">{transaction.reference}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Date & Time</span>
            <span className="text-sm font-bold">{new Date(transaction.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-100 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Payment Method</span>
            <span className="text-sm font-bold uppercase">{transaction.method}</span>
          </div>
          <div className="flex justify-between pt-8">
            <span className="text-xs font-black uppercase tracking-widest">Total Settled</span>
            <span className="text-3xl font-black tracking-tighter">KES {transaction.amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t-2 border-dashed border-zinc-200 text-center">
           <button className="w-full bg-black text-white py-5 font-black uppercase text-xs tracking-widest hover:bg-primary transition-all">
             Download PDF Receipt
           </button>
           <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mt-6">
             Verified by Carflex Financial Engine. This receipt is legally binding.
           </p>
        </div>
      </div>
    </div>
  );
}
