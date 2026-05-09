"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Meru10thOverview() {
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
      <section
        className="relative h-[700px] rounded-[3rem] overflow-hidden border transition-colors duration-300"
        style={{
          background: isDark ? "var(--surface)" : "var(--surface)",
          borderColor: "var(--glass-border)",
          boxShadow: isDark ? "var(--shadow-soft)" : "0 20px 50px rgba(17,24,39,0.08)",
        }}
      >
        <img
          src="/meru_10th_2026.jpg"
          alt="Meru Car Bazaar 10th Edition"
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.35), transparent)"
              : "linear-gradient(to top, rgba(245,242,235,0.95), rgba(245,242,235,0.55), transparent)",
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">
          <div className="space-y-4">
            <p className="text-primary text-xs font-black uppercase tracking-[0.8em] animate-pulse">Tactical Deployment</p>
            <h1
              className="text-7xl md:text-[9rem] font-black uppercase tracking-tighter leading-none italic transition-colors duration-300"
              style={{ color: "var(--foreground)" }}
            >
              MERU <br /> <span className="text-stroke">10TH.</span>
            </h1>
            <p className="text-xl md:text-2xl font-black uppercase tracking-[0.4em]" style={{ color: "var(--muted-foreground)" }}>
              ASK Meru Showground Hub
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">KES 500 ENTRY • 10:00 AM - 6:00 PM</p>
          </div>

          <div className="flex justify-center pt-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/events/meru-10th-2026/registrations"
                className="px-10 py-5 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all rounded-full border"
                style={{
                  background: "var(--surface)",
                  color: "var(--foreground)",
                  borderColor: "var(--glass-border)",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                View Registrations
              </Link>
              <Link
                href="/vendor/login"
                className="px-10 py-5 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all rounded-full border border-transparent"
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  boxShadow: "0 20px 50px rgba(230,0,0,0.35)",
                }}
              >
                Initialize Exhibitor Registration
              </Link>
            </div>
          </div>
        </div>
      </section>

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
          <h3 className="text-2xl font-black uppercase tracking-tighter italic" style={{ color: "var(--foreground)" }}>Event Timeline</h3>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Mission Date</p>
            <p className="text-xl font-black" style={{ color: "var(--foreground)" }}>Sunday, May 10, 2026</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Daily Ops</p>
            <p className="text-xl font-black" style={{ color: "var(--foreground)" }}>10:00 AM - 6:00 PM</p>
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
          <h3 className="text-2xl font-black uppercase tracking-tighter italic" style={{ color: "var(--foreground)" }}>Tactical Position</h3>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Location</p>
            <p className="text-xl font-black uppercase" style={{ color: "var(--foreground)" }}>ASK Meru Showground</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Ticket</p>
            <p className="text-xl font-black uppercase tracking-widest" style={{ color: "var(--foreground)" }}>KES 500</p>
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
          <h3 className="text-2xl font-black uppercase tracking-tighter italic" style={{ color: "var(--foreground)" }}>Mission Objective</h3>
          <p className="text-sm font-bold leading-relaxed uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
            The 10th edition delivers the updated KES 500 entry model with a fresh tactical poster identity and an expanded asset lineup.
          </p>
        </div>
      </section>
    </div>
  );
}
