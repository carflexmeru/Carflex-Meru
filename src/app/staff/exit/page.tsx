"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExitHubPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exitStatus, setExitStatus] = useState<"idle" | "authorizing" | "success">("idle");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    setAsset(null);
    setResults([]);

    try {
      const res = await fetch(`/api/gate/security-check?plate=${query}`);
      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setResults(data);
        if (data.length === 1) setAsset(data[0].vehicle);
      } else {
        setError("ASSET_NOT_FOUND: NO ACTIVE RECORD FOR THIS IDENTIFIER");
      }
    } catch (err) {
      setError("COMMUNICATION_FAILURE: MAIN_FRAME_OFFLINE");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalExit = async () => {
    if (!asset) return;
    setExitStatus("authorizing");
    
    try {
      const res = await fetch("/api/gate/exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId: asset.id }),
      });

      if (res.ok) {
        setExitStatus("success");
        setTimeout(() => {
          setAsset(null);
          setResults([]);
          setQuery("");
          setExitStatus("idle");
        }, 3000);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Exit authorization failed");
      }
    } catch (err: any) {
      setError(`EXIT_FAILED: ${err.message}`);
      setExitStatus("idle");
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">EXIT <br/> <span className="text-primary italic">COMMAND.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Final gate clearance and departure authorization.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Scan Column */}
           <div className="lg:col-span-1 space-y-8">
              <div className="nm-card p-10">
                 <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-8">Scan Exit Identifier</h3>
                 <form onSubmit={handleSearch} className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-zinc-500 text-[8px] font-black uppercase tracking-widest px-2">Plate / Exit Pass ID</label>
                       <div className="nm-inset">
                          <input 
                             type="text" 
                             required
                             value={query}
                             onChange={(e) => setQuery(e.target.value.toUpperCase())}
                             placeholder="KCX 123A"
                             className="w-full bg-transparent p-6 text-foreground font-black uppercase text-xl tracking-tighter outline-none placeholder:text-foreground/20 border-none"
                          />
                       </div>
                    </div>
                    <button 
                       type="submit"
                       disabled={loading}
                       className="w-full nm-card bg-primary text-white py-6 font-black uppercase tracking-widest text-xs shadow-[0_15px_30px_rgba(230,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all border-none"
                    >
                       {loading ? "SEARCHING..." : "FETCH ASSET DATA"}
                    </button>
                 </form>
              </div>

              {results.length > 1 && !asset && (
                <div className="nm-card p-8 animate-fade-in border-primary/20 border">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">EXIT COLLISION DETECTED</h3>
                  </div>
                  <div className="space-y-4">
                    {results.map((r, i) => (
                      <button 
                        key={i}
                        onClick={() => setAsset(r.vehicle)}
                        className="w-full nm-inset p-4 flex justify-between items-center hover:bg-white/5 transition-all text-left"
                      >
                        <div>
                          <p className="text-[9px] font-black text-zinc-500 uppercase">{r.vehicle.make} {r.vehicle.model}</p>
                          <p className="text-sm font-black text-foreground">{r.vehicle.regNumber}</p>
                        </div>
                        <span className="material-symbols-outlined text-primary text-sm">logout</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="nm-inset bg-primary/10 p-6 text-primary text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                   {error}
                </div>
              )}
           </div>

           {/* Asset Column */}
           <div className="lg:col-span-2">
              {!asset && exitStatus !== "success" && (
                <div className="nm-inset h-full flex flex-col items-center justify-center p-20 text-center opacity-20 border-dashed border-2 border-zinc-800">
                   <span className="material-symbols-outlined text-[100px] mb-6">door_front</span>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Gate Approach...</p>
                </div>
              )}

              {exitStatus === "success" && (
                <div className="nm-card p-20 text-center animate-scale-up border-green-500/20 bg-green-500/5">
                   <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                      <span className="material-symbols-outlined text-white text-5xl">check_circle</span>
                   </div>
                   <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 text-green-500">GATE RELEASED</h3>
                   <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Asset has been cleared for departure from the bazaar.</p>
                </div>
              )}

              {asset && exitStatus !== "success" && (
                <div className="space-y-8 animate-fade-in">
                   <div className="nm-card p-10 relative overflow-hidden border-none bg-primary/5">
                      <div className="absolute -right-8 -bottom-8 opacity-5">
                         <span className="material-symbols-outlined text-[200px]">verified</span>
                      </div>
                      <div className="relative z-10 flex justify-between items-end">
                         <div>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Departure Manifest</p>
                            <h2 className="text-6xl font-black uppercase tracking-tighter text-foreground">{asset.regNumber}</h2>
                            <p className="text-primary font-bold uppercase tracking-widest text-[10px] mt-2">Verified Bazaar Asset</p>
                            {results.length > 1 && (
                              <button 
                                onClick={() => setAsset(null)}
                                className="mt-4 text-[8px] font-black uppercase tracking-widest text-primary hover:underline block"
                              >
                                ← BACK TO COLLISION LIST
                              </button>
                            )}
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Check-in Time</p>
                            <p className="text-xl font-black text-foreground">{new Date(asset.createdAt).toLocaleTimeString()}</p>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="nm-card p-10">
                         <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-6">Owner/Subject</h3>
                         <p className="text-2xl font-black text-foreground uppercase tracking-tighter mb-1">{asset.owner?.name || "ANONYMOUS"}</p>
                         <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{asset.owner?.phone || "NO_CONTACT_DATA"}</p>
                      </div>
                      <div className="nm-card p-10">
                         <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-6">Zone/Location</h3>
                         <p className="text-2xl font-black text-foreground uppercase tracking-tighter mb-1">{asset.zone?.name || "GENERAL_ADMISSION"}</p>
                         <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Base Rate: KES {asset.zone?.price || 0}</p>
                      </div>
                   </div>

                   <button 
                     onClick={handleFinalExit}
                     disabled={exitStatus === "authorizing"}
                     className="w-full nm-card bg-primary text-white py-10 font-black uppercase tracking-[0.3em] text-lg shadow-[0_20px_50px_rgba(230,0,0,0.4)] hover:scale-[1.01] active:scale-98 transition-all border-none flex items-center justify-center gap-4"
                   >
                     {exitStatus === "authorizing" ? "CLEARING GATE..." : (
                       <>
                         <span className="material-symbols-outlined text-3xl">gate</span>
                         AUTHORIZE FINAL DEPARTURE
                       </>
                     )}
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>
    </StaffLayout>
  );
}
