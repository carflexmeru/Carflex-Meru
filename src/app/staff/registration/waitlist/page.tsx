"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useState, useEffect } from "react";

export default function WaitlistPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/vehicles/pending");
      const data = await res.json();
      if (Array.isArray(data)) {
        setVehicles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (id: string) => {
    try {
      const res = await fetch("/api/vehicles/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "active" }),
      });
      if (res.ok) fetchWaitlist();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-4">
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">OPERATIONAL <br/> <span className="text-primary italic text-stroke">WAITLIST.</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Managing assets currently in the staging and verification queue.</p>
          </div>
          <button 
            onClick={fetchWaitlist}
            className="nm-card p-4 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>

        <div className="nm-card p-10">
          <div className="space-y-6">
            {loading ? (
              <div className="nm-inset p-20 text-center animate-pulse">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Syncing Waitlist Manifest...</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="nm-inset p-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">Queue is currently clear.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-6">Plate</th>
                      <th className="px-6">Asset Specification</th>
                      <th className="px-6">Owner/Org</th>
                      <th className="px-6">Zone</th>
                      <th className="px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v) => (
                      <tr key={v.id} className="group">
                        <td className="px-6 py-4 nm-inset bg-zinc-900 rounded-l-2xl border-none">
                          <span className="text-xl font-black text-white tracking-tighter uppercase">{v.regNumber}</span>
                        </td>
                        <td className="px-6 py-4 nm-inset border-none">
                          <p className="text-white font-bold text-xs uppercase">{v.make} {v.model}</p>
                          <p className="text-[8px] text-zinc-500 uppercase">{v.year} • {v.color}</p>
                        </td>
                        <td className="px-6 py-4 nm-inset border-none">
                          <p className="text-zinc-400 font-black text-[10px] uppercase">{v.organization?.name || v.owner?.name || "ANON_USER"}</p>
                        </td>
                        <td className="px-6 py-4 nm-inset border-none">
                          <span className="nm-card px-3 py-1 text-[8px] font-black text-primary border-none">
                            {v.zone?.name || "UNASSIGNED"}
                          </span>
                        </td>
                        <td className="px-6 py-4 nm-inset rounded-r-2xl border-none text-right">
                          <button 
                            onClick={() => handleAuthorize(v.id)}
                            className="bg-primary text-white px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-[0_5px_15px_var(--primary-glow)]"
                          >
                            AUTHORIZE
                          </button>
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
