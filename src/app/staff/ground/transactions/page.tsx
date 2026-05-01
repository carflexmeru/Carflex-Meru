"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useState, useEffect } from "react";

export default function GroundTransactionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/staff/transactions");
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

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">GROUND <br/> <span className="text-primary italic text-stroke">LEDGER.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Verifying financial clearance for assets in physical bazaar sectors.</p>
        </div>

        <div className="nm-card p-10">
          <div className="space-y-6">
            {loading ? (
              <div className="nm-inset p-20 text-center animate-pulse">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Syncing Ground Revenue Manifest...</p>
              </div>
            ) : data.length === 0 ? (
              <div className="nm-inset p-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">No ground transactions detected.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-6">Node</th>
                      <th className="px-6">Plate</th>
                      <th className="px-6">Sector Status</th>
                      <th className="px-6 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(0, 10).map((t) => (
                      <tr key={t.id} className="group">
                        <td className="px-6 py-5 nm-inset bg-zinc-900 rounded-l-2xl border-none">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t.id.split('-')[0]}</span>
                        </td>
                        <td className="px-6 py-5 nm-inset border-none">
                          <p className="text-white font-black text-xl tracking-tighter uppercase">{t.vehicle?.regNumber || "ENTRY"}</p>
                        </td>
                        <td className="px-6 py-5 nm-inset border-none">
                           <span className="nm-card px-3 py-1 text-[8px] font-black text-primary border-none">
                             {t.vehicle?.zone?.name || "PARKED"}
                           </span>
                        </td>
                        <td className="px-6 py-5 nm-inset rounded-r-2xl border-none text-right">
                          <span className="text-2xl font-black text-white tracking-tighter">KES {t.paymentAmount.toLocaleString()}</span>
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
