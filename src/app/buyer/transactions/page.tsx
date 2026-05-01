"use client";

import { useState, useEffect } from "react";

export default function BuyerTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const phone = sessionStorage.getItem("guest_phone") || sessionStorage.getItem("vendor_phone");
      if (!phone) return;

      try {
        const res = await fetch(`/api/buyer/transactions?phone=${phone}`);
        const data = await res.json();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col gap-2 px-2">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Financial Transmission Ledger</p>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none text-foreground">BAZAAR <br/> <span className="text-stroke italic">LEDGER.</span></h1>
      </div>

      <div className="nm-card p-10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Timestamp</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Reference</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Asset Node</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status</th>
                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Amount (KES)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="py-8"><div className="nm-inset h-10 w-full"></div></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center opacity-20">
                    <span className="material-symbols-outlined text-[60px] mb-4">account_balance_wallet</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">No Transaction History Detected</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="py-6 text-xs font-bold text-zinc-400">{new Date(tx.checkInAt).toLocaleString()}</td>
                    <td className="py-6 font-black uppercase text-xs tracking-tighter italic">{tx.id.substring(0, 8)}</td>
                    <td className="py-6">
                       <p className="text-xs font-black uppercase text-foreground">{tx.vehicle?.make} {tx.vehicle?.model}</p>
                       <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Zone {tx.zone?.name || 'A'}</p>
                    </td>
                    <td className="py-6">
                       <span className={`text-[8px] font-black uppercase px-2 py-1 tracking-widest border ${tx.paymentStatus === 'paid' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-zinc-800 text-zinc-400 border-white/5'}`}>
                          {tx.paymentStatus}
                       </span>
                    </td>
                    <td className="py-6 text-right font-black text-white italic">
                       {tx.paymentAmount?.toLocaleString() || '0.00'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
