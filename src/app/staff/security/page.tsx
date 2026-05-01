"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useState } from "react";

export default function SecurityPage() {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`/api/gate/security-check?plate=${plate}`);
      const data = await res.json();
      
      if (data.vehicle) {
        setResult(data);
      } else {
        setError("NO_RECORD_FOUND: ASSET NOT REGISTERED");
      }
    } catch (err) {
      setError("COMMUNICATION_FAILURE: MAIN_FRAME_OFFLINE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-primary">SECURITY <br/> <span className="text-foreground italic text-stroke">VERIFICATION.</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Verifying asset integrity and checking against global security blacklists.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           {/* Search Column */}
           <div className="lg:col-span-1 space-y-8">
              <div className="nm-card p-10">
                 <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-8">Asset Search Node</h3>
                 <form onSubmit={handleSearch} className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-zinc-500 text-[8px] font-black uppercase tracking-widest px-2">Plate Number</label>
                       <div className="nm-inset">
                          <input 
                             type="text" 
                             required
                             value={plate}
                             onChange={(e) => setPlate(e.target.value.toUpperCase())}
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
                       {loading ? "SEARCHING..." : "INITIATE SCAN"}
                    </button>
                 </form>
              </div>

              {error && (
                <div className="nm-inset bg-primary/10 p-6 text-primary text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                   {error}
                </div>
              )}
           </div>

           {/* Result Column */}
           <div className="lg:col-span-2">
              {!result && !loading && (
                <div className="nm-inset h-full flex flex-col items-center justify-center p-20 text-center opacity-20 border-dashed border-2 border-zinc-800">
                   <span className="material-symbols-outlined text-[100px] mb-6">security_update_good</span>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Asset Signature...</p>
                </div>
              )}

              {loading && (
                 <div className="nm-inset h-full flex flex-col items-center justify-center p-20 text-center animate-pulse">
                    <span className="material-symbols-outlined text-[100px] mb-6 text-primary">radar</span>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Scanning Global Blacklists...</p>
                 </div>
              )}

              {result && (
                <div className="space-y-8 animate-fade-in">
                   <div className={`nm-card p-10 border-none relative overflow-hidden ${result.isStolen ? 'bg-primary/20' : 'bg-green-500/10'}`}>
                      <div className="absolute -right-8 -bottom-8 opacity-10">
                         <span className="material-symbols-outlined text-[200px]">
                            {result.isStolen ? 'warning' : 'verified'}
                         </span>
                      </div>
                      
                      <div className="relative z-10">
                         <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4">Verification Result</p>
                         <h2 className={`text-6xl font-black uppercase tracking-tighter ${result.isStolen ? 'text-primary' : 'text-green-500'}`}>
                            {result.isStolen ? 'ASSET_FLAGGED' : 'CLEAR_TO_ENTRY'}
                         </h2>
                         <p className="text-foreground font-bold uppercase tracking-widest text-[10px] mt-4">
                            Status: {result.vehicle.isVerified ? 'VERIFIED_BAZAAR_NODE' : 'PENDING_REGISTRATION'}
                         </p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="nm-card p-10">
                         <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-6">Asset Specifications</h3>
                         <div className="space-y-4">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                               <span className="text-[10px] text-zinc-500 font-black uppercase">Make/Model</span>
                               <span className="text-[10px] text-foreground font-black uppercase">{result.vehicle.make} {result.vehicle.model}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                               <span className="text-[10px] text-zinc-500 font-black uppercase">Plate</span>
                               <span className="text-[10px] text-foreground font-black uppercase">{result.vehicle.regNumber}</span>
                            </div>
                            <div className="flex justify-between">
                               <span className="text-[10px] text-zinc-500 font-black uppercase">Color</span>
                               <span className="text-[10px] text-foreground font-black uppercase">{result.vehicle.color}</span>
                            </div>
                         </div>
                      </div>

                      <div className="nm-card p-10">
                         <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-6">Identity Link</h3>
                         <div className="space-y-4">
                            <div className="flex justify-between border-b border-white/5 pb-2">
                               <span className="text-[10px] text-zinc-500 font-black uppercase">Owner</span>
                               <span className="text-[10px] text-foreground font-black uppercase">{result.vehicle.owner?.name || "INDIVIDUAL"}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-2">
                               <span className="text-[10px] text-zinc-500 font-black uppercase">Phone</span>
                               <span className="text-[10px] text-foreground font-black uppercase">{result.vehicle.owner?.phone || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                               <span className="text-[10px] text-zinc-500 font-black uppercase">Sector</span>
                               <span className="text-[10px] text-foreground font-black uppercase">{result.vehicle.zone?.name || "UNASSIGNED"}</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </StaffLayout>
  );
}
