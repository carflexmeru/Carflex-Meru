"use client";

export default function MeruEventMap() {
  const sectors = [
    { name: "ZONE A", description: "Elite Luxury & SUV Deployment", icon: "diamond" },
    { name: "ZONE B", description: "Commercial & Utility Utility Assets", icon: "agriculture" },
    { name: "ZONE C", description: "Fleet & Economy Logistics", icon: "local_shipping" },
    { name: "MAIN GATE", description: "Public Access & Identity Clearance", icon: "gate" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-16">
      <div className="flex flex-col gap-2 text-center items-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Spatial Intelligence</p>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">TACTICAL <br/> <span className="text-stroke italic">MAP.</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">Operational layout of the ASK Meru Showground arena.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* The Visual Map */}
         <div className="lg:col-span-2 nm-card p-4 bg-zinc-900 border-none overflow-hidden rounded-[3rem] group">
            <img 
               src="/meru_showground_map_1777632374555.png" 
               alt="Tactical Map" 
               className="w-full h-full object-cover rounded-[2.5rem] transition-all duration-700"
            />
         </div>

         {/* Sector Legend */}
         <div className="lg:col-span-1 space-y-6">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border-b border-white/5 pb-4">Sector Legend</h3>
            <div className="space-y-4">
               {sectors.map((sector, i) => (
                 <div key={i} className="nm-inset p-8 flex items-center gap-6 group hover:bg-white/5 transition-all">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                       <span className="material-symbols-outlined">{sector.icon}</span>
                    </div>
                    <div>
                       <h4 className="text-lg font-black text-foreground uppercase tracking-tight italic">{sector.name}</h4>
                       <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{sector.description}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="nm-card p-10 bg-primary/5 space-y-4 border border-primary/20">
               <div className="flex items-center gap-4 text-primary">
                  <span className="material-symbols-outlined text-sm">info</span>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em]">Deployment Protocol</p>
               </div>
               <p className="text-zinc-500 text-xs font-bold leading-relaxed uppercase tracking-wide">
                  Exhibitors must report to the Main Command Node before asset positioning in their designated zones.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
