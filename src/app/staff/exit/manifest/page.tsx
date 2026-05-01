"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InsideManifestPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const fetchManifest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gate/manifest?status=active");
      const data = await res.json();
      setAssets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Manifest fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManifest();
  }, []);

  const filteredAssets = assets.filter(a => 
    a.regNumber.toLowerCase().includes(search.toLowerCase()) ||
    (a.owner?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">INSIDE <br/> <span className="text-primary italic">MANIFEST.</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Real-time audit of all assets currently in-bounds.</p>
          </div>
          
          <div className="nm-card p-6 flex items-center gap-6 min-w-[300px]">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Total Units</p>
                <p className="text-4xl font-black text-foreground tracking-tighter">{assets.length}</p>
             </div>
             <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">groups</span>
             </div>
          </div>
        </div>

        <div className="nm-card p-8">
           <div className="flex flex-col md:flex-row gap-6 mb-10">
              <div className="flex-1 nm-inset flex items-center px-6">
                 <span className="material-symbols-outlined text-zinc-500 mr-4">search</span>
                 <input 
                    type="text" 
                    placeholder="SEARCH BY PLATE OR OWNER..."
                    className="w-full bg-transparent p-6 text-foreground font-black uppercase text-xs tracking-widest outline-none placeholder:text-foreground/20 border-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                 />
              </div>
              <button 
                onClick={fetchManifest}
                className="nm-card p-6 text-zinc-500 hover:text-primary transition-all flex items-center gap-2 border-none"
              >
                <span className="material-symbols-outlined text-xl">refresh</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Resync Manifest</span>
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="nm-card h-48 animate-pulse bg-zinc-900/10"></div>
                ))
              ) : filteredAssets.length === 0 ? (
                <div className="col-span-full py-20 text-center opacity-30">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Assets Detected in Active Space.</p>
                </div>
              ) : filteredAssets.map((asset) => (
                <div key={asset.id} className="nm-card p-8 group hover:bg-primary/5 transition-all relative overflow-hidden border-none">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">{asset.make} {asset.model}</p>
                         <h3 className="text-3xl font-black text-foreground tracking-tighter">{asset.regNumber}</h3>
                      </div>
                      <div className="nm-inset px-3 py-1 text-[8px] font-black text-primary uppercase tracking-widest">
                         {asset.zone?.name || "GROUND"}
                      </div>
                   </div>

                   <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-[9px] font-bold">
                         <span className="text-zinc-500 uppercase tracking-widest">In-Bounds Since</span>
                         <span className="text-foreground">{new Date(asset.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between text-[9px] font-bold">
                         <span className="text-zinc-500 uppercase tracking-widest">Subject</span>
                         <span className="text-foreground uppercase">{asset.owner?.name || "ANONYMOUS"}</span>
                      </div>
                   </div>

                   <button 
                     onClick={() => router.push(`/staff/exit?plate=${asset.regNumber}`)}
                     className="w-full nm-inset p-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-white transition-all"
                   >
                     RELEASE ASSET
                   </button>
                </div>
              ))}
           </div>
        </div>
      </div>
    </StaffLayout>
  );
}
