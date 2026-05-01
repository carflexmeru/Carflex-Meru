"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useState, useEffect } from "react";

export default function ExitTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/staff/transactions");
        const data = await res.json();
        // Filter for transactions that happened at the exit gate
        // In production, we'd have a specific type or agentId filter
        setTransactions(data);
      } catch (err) {
        console.error("Transactions fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.paymentAmount || 0), 0);

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">EXIT <br/> <span className="text-primary italic">LEDGER.</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Real-time monitoring of exit-gate revenue streams.</p>
          </div>
          
          <div className="nm-card p-6 flex items-center gap-6 min-w-[300px]">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Aggregate Revenue</p>
                <p className="text-4xl font-black text-foreground tracking-tighter">KES {totalRevenue.toLocaleString()}</p>
             </div>
             <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-green-500">payments</span>
             </div>
          </div>
        </div>

        <div className="nm-card p-10">
           <div className="space-y-6">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="nm-inset h-20 animate-pulse"></div>
                ))
              ) : transactions.length === 0 ? (
                <div className="py-20 text-center opacity-30">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Exit Transactions Recorded.</p>
                </div>
              ) : transactions.map((t) => (
                <div key={t.id} className="nm-inset p-6 flex justify-between items-center group hover:bg-green-500/5 transition-all">
                   <div className="flex items-center gap-6">
                      <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                         <span className="material-symbols-outlined text-green-500 text-sm">receipt_long</span>
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">{new Date(t.checkInAt).toLocaleString()}</p>
                         <p className="text-lg font-black text-foreground uppercase tracking-tight">Plate: {t.vehicle?.regNumber}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-2xl font-black text-foreground tracking-tighter">KES {t.paymentAmount}</p>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">{t.paymentMethod}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </StaffLayout>
  );
}
