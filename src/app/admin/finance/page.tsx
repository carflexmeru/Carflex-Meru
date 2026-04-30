"use client";

import { useEffect, useState } from "react";

export default function FinanceRecon() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinance();
  }, []);

  async function fetchFinance() {
    const res = await fetch("/api/admin/finance");
    if (res.ok) {
      const result = await res.json();
      setData(result);
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;

  const variance = data.actual - data.expected;

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Ledger Balance */}
        <div className="bg-white border-4 border-black p-12 shadow-[20px_20px_0px_#0A0A0A]">
           <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Master Ledger Recon</h3>
           <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-zinc-100">
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Expected Revenue (Bookings)</span>
                 <span className="text-xl font-bold">KES {data.expected.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-zinc-100">
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Actual Revenue (Transactions)</span>
                 <span className="text-xl font-bold">KES {data.actual.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-8">
                 <span className="text-xs font-black uppercase tracking-widest">Net Variance</span>
                 <span className={`text-4xl font-black tracking-tighter ${variance >= 0 ? 'text-green-600' : 'text-primary'}`}>
                    {variance >= 0 ? '+' : ''}KES {variance.toLocaleString()}
                 </span>
              </div>
           </div>
           {variance !== 0 && (
             <div className="mt-8 bg-primary/10 border-2 border-primary p-6 flex gap-4 items-center">
                <span className="material-symbols-outlined text-primary">warning</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Discrepancy detected. Review manual overrides in Audit Logs.</p>
             </div>
           )}
        </div>

        {/* Breakdown by Method */}
        <div className="bg-[#0A0A0A] text-white p-12">
           <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Collection Breakdown</h3>
           <div className="space-y-8">
              {data.breakdown.map((b: any) => (
                <div key={b.method} className="bg-white/5 p-8 border border-white/10 flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Collection Method</p>
                      <p className="text-xl font-black uppercase">{b.method}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total Handled</p>
                      <p className="text-2xl font-black tracking-tighter">KES {b.amount.toLocaleString()}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
