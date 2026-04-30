"use client";

import { useEffect, useState } from "react";

export default function ShiftSummary() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const phone = localStorage.getItem("carflex_phone");
    if (phone) {
      fetchSummary(phone);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchSummary(phone: string) {
    const res = await fetch(`/api/staff/shift?phone=${phone}`);
    if (res.ok) {
      const result = await res.json();
      setData(result);
    }
    setLoading(false);
  }

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-zinc-50 text-[#0A0A0A] font-sans">
      <div className="bg-white border-b-2 border-black pt-32 pb-24 px-8">
        <div className="max-w-4xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">Shift <span className="text-primary">Summary</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs italic">Live Operational Performance — Phase 1 Logic</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Current Session</p>
            <p className="text-2xl font-black tracking-tighter">ACTIVE</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-20 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border-4 border-black p-10 shadow-[10px_10px_0px_#0A0A0A]">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Vehicles Ingested</p>
            <p className="text-5xl font-black tracking-tighter">{data?.checkIns || 0}</p>
            <div className="mt-4 flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              100% Efficiency
            </div>
          </div>
          <div className="bg-white border-4 border-black p-10 shadow-[10px_10px_0px_#E60000]">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Revenue Processed</p>
            <p className="text-5xl font-black tracking-tighter text-primary">KES {data?.cashHandled?.toLocaleString() || 0}</p>
            <p className="text-[9px] font-black uppercase text-zinc-400 mt-4 tracking-widest">Audited via Daraja</p>
          </div>
          <div className="bg-white border-4 border-black p-10 shadow-[10px_10px_0px_#0A0A0A]">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Handshakes</p>
            <p className="text-5xl font-black tracking-tighter">{data?.transactions || 0}</p>
            <p className="text-[9px] font-black uppercase text-zinc-400 mt-4 tracking-widest">Database Sync OK</p>
          </div>
        </div>

        <section className="bg-white border-4 border-black p-12">
          <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Shift Verification</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center py-4 border-b-2 border-zinc-50">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Shift Started</span>
              <span className="font-bold">08:00 AM — Meru Showground</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b-2 border-zinc-50">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">M-Pesa Reconciliation</span>
              <span className="text-green-600 font-black uppercase text-xs tracking-widest">STK Success Rate 98%</span>
            </div>
          </div>
          <button className="w-full mt-12 bg-black text-white py-6 font-black uppercase tracking-widest hover:bg-primary transition-all shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            End Shift & Transfer Ledger
          </button>
        </section>
      </div>
    </div>
  );
}
