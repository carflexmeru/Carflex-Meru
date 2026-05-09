"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useState, useEffect } from "react";

export default function TransactionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState("");

  useEffect(() => {
    const syncEvent = () => setActiveEvent(localStorage.getItem("carflex_staff_event") || "");
    syncEvent();
    window.addEventListener("staffeventchange", syncEvent);
    fetchTransactions();
    return () => window.removeEventListener("staffeventchange", syncEvent);
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const qs = activeEvent ? `?eventName=${encodeURIComponent(activeEvent)}` : "";
      const res = await fetch(`/api/staff/transactions${qs}`);
      const transactions = await res.json();
      if (Array.isArray(transactions)) {
        setData(transactions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = data.reduce((acc, t) => acc + (t.paymentAmount || 0), 0);

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-3 py-1 text-[9px] font-black uppercase tracking-[0.35em] text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_#E60000]" />
              Active Event: {activeEvent || "None selected"}
            </div>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">REVENUE <br/> <span className="text-primary italic text-stroke">STREAM.</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Monitoring real-time financial intakes and clearance logs.</p>
          </div>
          
          <div className="nm-card p-8 bg-primary/5 border-none">
            <p className="text-[8px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-2">Total Daily Revenue</p>
            <p className="text-4xl font-black text-foreground tracking-tighter">KES {totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="nm-card p-10">
          <div className="space-y-6">
            {loading ? (
              <div className="nm-inset p-20 text-center animate-pulse">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Syncing Financial Matrix...</p>
              </div>
            ) : data.length === 0 ? (
              <div className="nm-inset p-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">No transactions recorded for this session.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-6">Timestamp</th>
                      <th className="px-6">Reference</th>
                      <th className="px-6">Vehicle / Asset</th>
                      <th className="px-6">Method</th>
                      <th className="px-6 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((t) => (
                      <tr key={t.id} className="group">
                        <td className="px-6 py-5 nm-inset bg-zinc-900 rounded-l-2xl border-none">
                          <p className="text-[10px] font-bold text-foreground uppercase">{new Date(t.createdAt).toLocaleTimeString()}</p>
                          <p className="text-[8px] text-zinc-600">{new Date(t.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-5 nm-inset border-none">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t.id.split('-')[0]}</span>
                        </td>
                        <td className="px-6 py-5 nm-inset border-none">
                          <p className="text-foreground font-bold text-xs uppercase">{t.vehicle?.regNumber || "GENERIC_ENTRY"}</p>
                          <p className="text-[8px] text-zinc-500 uppercase">{t.user?.phone || "ANON_PAYER"}</p>
                        </td>
                        <td className="px-6 py-5 nm-inset border-none">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            t.paymentMethod === 'cash' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'
                          }`}>
                            {t.paymentMethod || 'SYSTEM'}
                          </span>
                        </td>
                        <td className="px-6 py-5 nm-inset rounded-r-2xl border-none text-right">
                          <span className="text-xl font-black text-foreground tracking-tighter">KES {t.paymentAmount.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
