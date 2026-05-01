"use client";

import { useEffect, useState } from "react";

interface Vehicle {
  id: string;
  regNumber: string;
  make: string;
  model: string;
  year: number;
  owner: { fullName: string; phone: string; idNumber: string | null } | null;
  zone: { name: string } | null;
  createdAt: string;
}

export default function AgentVerification() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [idNumberInput, setIdNumberInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    try {
      const res = await fetch("/api/vehicles/pending");
      const data = await res.json();
      setVehicles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleVerify = async () => {
    if (!selectedVehicle) return;
    setIsVerifying(true);

    try {
      const res = await fetch("/api/vehicles/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: selectedVehicle.id,
          idNumber: idNumberInput,
        }),
      });

      if (res.ok) {
        setSelectedVehicle(null);
        setIdNumberInput("");
        fetchPending();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">Agent 2: Verification</h1>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mt-1">Ground Assets Control</p>
        </div>
        <div className="bg-primary/20 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/30">
          {vehicles.length} PENDING
        </div>
      </div>

      {vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="material-symbols-outlined text-6xl text-white/10 mb-4">task_alt</span>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">All assets verified for today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setSelectedVehicle(v);
                setIdNumberInput(v.owner?.idNumber || "");
              }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:border-primary/50 transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-4xl">verified_user</span>
              </div>
              <p className="text-primary font-black text-xs uppercase tracking-widest mb-1">{v.zone?.name}</p>
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-4">{v.regNumber}</h3>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Vendor</p>
                <p className="text-sm font-bold">{v.owner?.name || "UNKNOWN"}</p>
                <p className="text-xs text-zinc-400 font-mono">{v.owner?.phone}</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                <span>Start Verification</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Verification Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedVehicle(null)}></div>
          <div className="relative bg-[#0A0A0A] border border-white/10 w-full max-w-lg rounded-t-3xl md:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-scale-up">
            <div className="p-8 border-b border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">Asset ID: {selectedVehicle.id.slice(0, 8)}</p>
                  <h2 className="text-3xl font-black uppercase tracking-tight">{selectedVehicle.regNumber}</h2>
                </div>
                <button onClick={() => setSelectedVehicle(null)} className="text-zinc-500 hover:text-white">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Instructions</p>
                  <p className="text-xs font-medium text-zinc-300 leading-relaxed">
                    1. Inspect the vehicle condition matches descriptions.<br/>
                    2. Scan or manually enter the Vendor's National ID.<br/>
                    3. Confirm the vehicle is in the correct zone.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Vendor ID Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={idNumberInput}
                      onChange={(e) => setIdNumberInput(e.target.value)}
                      placeholder="ENTER NATIONAL ID"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white font-black tracking-widest uppercase focus:border-primary focus:bg-white/10 outline-none transition-all"
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                      <span className="material-symbols-outlined">qr_code_scanner</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="py-4 rounded-xl border border-white/10 font-black text-[10px] uppercase tracking-widest hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerify}
                  disabled={isVerifying || !idNumberInput}
                  className="py-4 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-[0_0_30px_rgba(230,0,0,0.3)] disabled:opacity-50"
                >
                  {isVerifying ? "Processing..." : "Confirm Verification"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
