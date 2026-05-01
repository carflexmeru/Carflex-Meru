"use client";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-24 space-y-24">
      {/* Hero Section */}
      <div className="flex flex-col gap-4 max-w-4xl">
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.8em]">Operational Briefing</p>
        <h1 className="text-8xl font-black uppercase tracking-tighter leading-[0.9] italic">
          DEFINING <br/> <span className="text-stroke">EXCELLENCE.</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-8 leading-relaxed">
          Carflex is more than a marketplace; it is a high-trust ecosystem designed for the modern automotive professional. From forensic verification to seamless bazaar operations, we define the standard of quiet luxury in the digital age.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="nm-card p-12 space-y-6">
           <span className="material-symbols-outlined text-primary text-5xl">shield_check</span>
           <h3 className="text-3xl font-black uppercase tracking-tighter italic">Forensic Trust.</h3>
           <p className="text-zinc-400 text-sm leading-relaxed uppercase tracking-wide">
             Every asset in our registry undergoes a multi-point verification protocol. We eliminate the friction of uncertainty, ensuring that every transaction is backed by verified data and legitimate ownership.
           </p>
        </div>
        <div className="nm-card p-12 space-y-6">
           <span className="material-symbols-outlined text-primary text-5xl">speed</span>
           <h3 className="text-3xl font-black uppercase tracking-tighter italic">Tactical Velocity.</h3>
           <p className="text-zinc-400 text-sm leading-relaxed uppercase tracking-wide">
             Our infrastructure is built for speed. From gate-entry registration to real-time bargaining, we empower vendors and buyers to execute missions with unprecedented efficiency.
           </p>
        </div>
      </div>

      {/* Stats Node */}
      <div className="nm-inset p-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
         <div className="space-y-2">
            <p className="text-4xl font-black text-white italic">2026</p>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Est. Operations</p>
         </div>
         <div className="space-y-2">
            <p className="text-4xl font-black text-primary italic">100%</p>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Asset Verification</p>
         </div>
         <div className="space-y-2">
            <p className="text-4xl font-black text-white italic">24/7</p>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Tactical Support</p>
         </div>
      </div>

      {/* Vision Statement */}
      <div className="flex justify-end text-right">
         <div className="max-w-2xl space-y-6">
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">A VISION FOR <br/> <span className="text-primary italic underline underline-offset-8">THE FUTURE.</span></h2>
            <p className="text-zinc-400 text-sm uppercase tracking-widest leading-loose">
              We are building the infrastructure for the next generation of car bazaars. By integrating spatial awareness, forensic identity, and real-time bargaining, Carflex is the definitive platform for automotive trade in East Africa.
            </p>
         </div>
      </div>
    </div>
  );
}
