"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MeruEventOverview() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const readTheme = () => {
      setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    };

    readTheme();
    window.addEventListener("themechange", readTheme);
    window.addEventListener("storage", readTheme);

    return () => {
      window.removeEventListener("themechange", readTheme);
      window.removeEventListener("storage", readTheme);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-24">
      {/* Hero Section */}
      <section
        className="relative h-[700px] rounded-[3rem] overflow-hidden border transition-colors duration-300"
        style={{
          background: "var(--surface)",
          borderColor: "var(--glass-border)",
          boxShadow: isDark ? "var(--shadow-soft)" : "0 20px 50px rgba(17,24,39,0.08)",
        }}
      >
        <img 
          src="/meru_bazaar_hero_1777632277515.png" 
          alt="Meru Car Bazaar" 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), transparent)"
              : "linear-gradient(to top, rgba(245,242,235,0.95), rgba(245,242,235,0.55), transparent)",
          }}
        />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">
           <div className="space-y-4">
              <p className="text-primary text-xs font-black uppercase tracking-[0.8em] animate-pulse">Tactical Deployment</p>
              <h1 className="text-8xl md:text-[10rem] font-black uppercase tracking-tighter leading-none italic" style={{ color: "var(--foreground)" }}>
                MERU <br/> <span className="text-stroke">BAZAAR.</span>
              </h1>
              <p className="text-2xl font-black uppercase tracking-[0.4em]" style={{ color: "var(--muted-foreground)" }}>ASK Meru Showground Hub</p>
           </div>

           <div className="flex justify-center pt-12">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/events/meru-2026/registrations"
                  className="px-10 py-5 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all rounded-full border"
                  style={{
                    background: "var(--surface)",
                    color: "var(--foreground)",
                    borderColor: "var(--glass-border)",
                    boxShadow: "var(--shadow-soft)",
                  }}
                >
                  VIEW REGISTRATIONS
                </Link>
                <Link
                  href="/vendor/login"
                  className="px-10 py-5 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all rounded-full border border-transparent"
                  style={{
                    background: "var(--primary)",
                    color: "#fff",
                    boxShadow: "0 20px 50px rgba(230,0,0,0.4)",
                  }}
                >
                  INITIALIZE EXHIBITOR REGISTRATION
                </Link>
              </div>
           </div>
        </div>
      </section>

      {/* Operational Briefing */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div
           className="p-12 space-y-6 rounded-[2rem] border"
           style={{
             background: "var(--surface)",
             borderColor: "var(--glass-border)",
             boxShadow: "var(--shadow-soft)",
           }}
         >
            <span className="material-symbols-outlined text-primary text-4xl">calendar_today</span>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic" style={{ color: "var(--foreground)" }}>EVENT TIMELINE</h3>
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Mission Date</p>
               <p className="text-xl font-black" style={{ color: "var(--foreground)" }}>SUNDAY, MAY 03, 2026</p>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Daily Ops</p>
               <p className="text-xl font-black" style={{ color: "var(--foreground)" }}>7:00 AM - 6:00 PM</p>
            </div>
         </div>

         <div
           className="p-12 space-y-6 rounded-[2rem] border"
           style={{
             background: "var(--surface)",
             borderColor: "var(--glass-border)",
             boxShadow: "var(--shadow-soft)",
           }}
         >
            <span className="material-symbols-outlined text-primary text-4xl">location_on</span>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic" style={{ color: "var(--foreground)" }}>TACTICAL POSITION</h3>
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Location</p>
               <p className="text-xl font-black uppercase" style={{ color: "var(--foreground)" }}>ASK Meru Showground</p>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Sector</p>
               <p className="text-xl font-black uppercase tracking-widest" style={{ color: "var(--foreground)" }}>Main Exhibition Arena</p>
            </div>
         </div>

         <div
           className="p-12 space-y-6 rounded-[2rem] border"
           style={{
             background: "var(--surface)",
             borderColor: "var(--glass-border)",
             boxShadow: "var(--shadow-soft)",
           }}
         >
            <span className="material-symbols-outlined text-primary text-4xl">security</span>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic" style={{ color: "var(--foreground)" }}>MISSION OBJECTIVE</h3>
            <p className="text-sm font-bold leading-relaxed uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
               A high-stakes exhibition of Kenya's finest automotive assets. Uniting verified vendors and premium buyers in a secure showground environment.
            </p>
         </div>
      </section>

      {/* Featured Fleet Preview */}
      <section className="space-y-12">
         <div className="flex justify-between items-end">
            <div className="space-y-2">
               <p className="text-primary text-[10px] font-black uppercase tracking-widest">Operational Intel</p>
               <h2 className="text-5xl font-black uppercase tracking-tighter italic italic" style={{ color: "var(--foreground)" }}>FEATURED <span className="text-stroke">ASSETS.</span></h2>
            </div>
            <Link href="/events/meru-2026/listings" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all underline decoration-primary underline-offset-8" style={{ color: "var(--muted-foreground)" }}>
               VIEW FULL YARD MANIFEST
            </Link>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Sample Asset Preview */}
            {Array(4).fill(0).map((_, i) => (
              <div
                key={i}
                className="group relative h-[400px] overflow-hidden rounded-[2rem] border hover:scale-[1.02] transition-all"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--glass-border)",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                 <div className="absolute inset-0 animate-pulse" style={{ background: isDark ? "#1b1b1b" : "#ece7df" }}></div>
                 <div
                   className="absolute bottom-0 inset-x-0 p-8"
                   style={{
                     background: isDark
                       ? "linear-gradient(to top, rgba(0,0,0,0.96), transparent)"
                       : "linear-gradient(to top, rgba(245,242,235,0.96), transparent)",
                   }}
                 >
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Coming Soon</p>
                    <p className="text-xl font-black uppercase tracking-tighter italic" style={{ color: "var(--foreground)" }}>LUXURY SPEC ASSET</p>
                 </div>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}
