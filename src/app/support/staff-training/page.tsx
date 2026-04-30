export default function StaffTraining() {
  const MODULES = [
    { code: "MOD-A1", title: "Gate Protocol", status: "Required" },
    { code: "MOD-A2", title: "Visual Verification Standards", status: "Required" },
    { code: "MOD-F1", title: "Financial Reconciliation", status: "Advanced" },
    { code: "MOD-S1", title: "Conflict Resolution", status: "Required" },
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Staff <span className="text-primary italic">Academy.</span></h1>
        <p className="text-xl font-bold text-zinc-500 max-w-2xl">Ensuring operational excellence across the bazaar.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MODULES.map((m) => (
          <div key={m.code} className="p-8 border-4 border-black flex justify-between items-center hover:bg-zinc-50 transition-all">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{m.code}</span>
              <h3 className="text-xl font-black uppercase tracking-tight">{m.title}</h3>
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{m.status}</span>
               <button className="bg-black text-white px-6 py-2 font-black uppercase text-[10px] tracking-widest">Start</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
