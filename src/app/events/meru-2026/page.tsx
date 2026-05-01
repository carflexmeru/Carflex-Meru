"use client";

import Link from "next/link";

export default function MeruEventOverview() {
  return (
    <div className="max-w-7xl mx-auto px-8 space-y-24">
      {/* Hero Section */}
      <section className="relative h-[700px] rounded-[3rem] overflow-hidden nm-card border-none">
        <img 
          src="/meru_bazaar_hero_1777632277515.png" 
          alt="Meru Car Bazaar" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">
           <div className="space-y-4">
              <p className="text-primary text-xs font-black uppercase tracking-[0.8em] animate-pulse">Tactical Deployment</p>
              <h1 className="text-8xl md:text-[10rem] font-black uppercase tracking-tighter leading-none italic">
                MERU <br/> <span className="text-stroke">BAZAAR.</span>
              </h1>
              <p className="text-2xl font-black uppercase tracking-[0.4em] text-zinc-400">ASK Meru Showground Hub</p>
           </div>

           <div className="flex justify-center pt-12">
              <Link href="/vendor/login" className="nm-card bg-primary text-white px-16 py-6 font-black uppercase tracking-widest text-[11px] shadow-[0_20px_50px_rgba(230,0,0,0.4)] hover:scale-105 transition-all border-none">
                INITIALIZE EXHIBITOR REGISTRATION
              </Link>
           </div>
        </div>
      </section>

      {/* Operational Briefing */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="nm-card p-12 space-y-6">
            <span className="material-symbols-outlined text-primary text-4xl">calendar_today</span>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">EVENT TIMELINE</h3>
            <div className="space-y-2">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Mission Date</p>
               <p className="text-xl font-black text-white">SUNDAY, MAY 03, 2026</p>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Daily Ops</p>
               <p className="text-xl font-black text-white">07:00 - 18:00 HRS</p>
            </div>
         </div>

         <div className="nm-card p-12 space-y-6">
            <span className="material-symbols-outlined text-primary text-4xl">location_on</span>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">TACTICAL POSITION</h3>
            <div className="space-y-2">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Location</p>
               <p className="text-xl font-black text-white uppercase">ASK Meru Showground</p>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sector</p>
               <p className="text-xl font-black text-white uppercase tracking-widest">Main Exhibition Arena</p>
            </div>
         </div>

         <div className="nm-card p-12 space-y-6">
            <span className="material-symbols-outlined text-primary text-4xl">security</span>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic">MISSION OBJECTIVE</h3>
            <p className="text-zinc-500 text-sm font-bold leading-relaxed uppercase tracking-wide">
               A high-stakes exhibition of Kenya's finest automotive assets. Uniting verified vendors and premium buyers in a secure showground environment.
            </p>
         </div>
      </section>

      {/* Featured Fleet Preview */}
      <section className="space-y-12">
         <div className="flex justify-between items-end">
            <div className="space-y-2">
               <p className="text-primary text-[10px] font-black uppercase tracking-widest">Operational Intel</p>
               <h2 className="text-5xl font-black uppercase tracking-tighter italic italic">FEATURED <span className="text-stroke">ASSETS.</span></h2>
            </div>
            <Link href="/events/meru-2026/listings" className="text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all underline decoration-primary underline-offset-8">
               VIEW FULL YARD MANIFEST
            </Link>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Sample Asset Preview */}
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="nm-card group relative h-[400px] overflow-hidden border-none hover:scale-[1.02] transition-all">
                 <div className="absolute inset-0 bg-zinc-900 animate-pulse"></div>
                 <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black to-transparent">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Coming Soon</p>
                    <p className="text-xl font-black text-white uppercase tracking-tighter italic">LUXURY SPEC ASSET</p>
                 </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}
