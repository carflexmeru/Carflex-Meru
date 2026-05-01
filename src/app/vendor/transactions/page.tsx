"use client";

import { useState, useEffect } from "react";

export default function VendorTransactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const phone = sessionStorage.getItem("vendor_phone");
      if (!phone) return;

      try {
        const res = await fetch(`/api/vendor/transactions?phone=${phone}`);
        const result = await res.json();
        setTransactions(result);
      } catch (err) {
        console.error("Transactions fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalSpent = transactions.reduce((sum, t) => sum + (t.paymentAmount || 0), 0);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Financial Ledger</p>
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">OPERATIONAL <br/> <span className="text-stroke italic">COSTS.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">Audit of all gate entries and marketplace fees.</p>
        </div>
        
        <div className="nm-card p-10 flex items-center gap-10 min-w-[350px] bg-primary/5">
           <div className="text-right flex-1">
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-1">Aggregate Expenditure</p>
              <p className="text-5xl font-black text-foreground tracking-tighter italic">KES {totalSpent.toLocaleString()}</p>
           </div>
           <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-[0_15px_30px_rgba(230,0,0,0.3)]">
              <span className="material-symbols-outlined text-white text-3xl">payments</span>
           </div>
        </div>
      </div>

      <div className="nm-card p-10 space-y-6">
         {loading ? (
           Array(5).fill(0).map((_, i) => (
             <div key={i} className="nm-inset h-24 animate-pulse"></div>
           ))
         ) : transactions.length === 0 ? (
           <div className="py-20 text-center opacity-30">
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Financial Records Found for This Identity Node.</p>
           </div>
         ) : (
           <div className="space-y-4">
              {transactions.map((t) => (
                <div key={t.id} className="nm-inset p-8 flex justify-between items-center group hover:bg-white/5 transition-all">
                   <div className="flex items-center gap-8">
                      <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-white/5">
                         <span className="material-symbols-outlined text-zinc-500 text-xl">receipt_long</span>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{new Date(t.checkInAt).toLocaleString()}</p>
                         <h4 className="text-xl font-black text-foreground uppercase tracking-tight italic">GATE ENTRY: {t.vehicle?.regNumber}</h4>
                         <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{t.zone?.name || "Standard Zone"}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-3xl font-black text-foreground tracking-tighter">KES {(t.paymentAmount || 0).toLocaleString()}</p>
                      <div className="flex items-center justify-end gap-2 mt-1">
                         <span className={`w-1.5 h-1.5 rounded-full ${t.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-primary'}`}></span>
                         <p className={`text-[10px] font-black uppercase tracking-widest ${t.paymentStatus === 'paid' ? 'text-green-500' : 'text-primary'}`}>{t.paymentStatus}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
}
