"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import LiveGallery from "@/components/LiveGallery";
import CollegeWaitlistModal from "@/components/CollegeWaitlistModal";

export default function LandingPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const syncTheme = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light");

    handleScroll();
    syncTheme();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("themechange", syncTheme);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("themechange", syncTheme);
    };
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden selection:bg-primary selection:text-white transition-colors duration-500"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="liquid-bg">
        <div className="liquid-blob" style={{ top: "10%", left: "10%", animationDelay: "0s" }} />
        <div
          className="liquid-blob"
          style={{
            bottom: "10%",
            right: "10%",
            animationDelay: "-5s",
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(230,0,0,0.06)",
          }}
        />
      </div>

      <section
        className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-[120vw] h-[120vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-125 object-cover"
          >
            <source src="/hero_video.mp4" type="video/mp4" />
            <source src="/event assets/VID-20260429-WA0000.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: isDark ? "rgba(0,0,0,0.42)" : "rgba(240,235,227,0.18)",
            }}
          />
        </div>

        <div
          className="absolute inset-0 z-20 pointer-events-none select-none flex items-center justify-center transition-transform duration-75"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <svg viewBox="0 0 1000 500" className="w-full h-full">
            <defs>
              <mask id="heroInversionMask">
                <rect width="1000" height="500" fill="white" />
                <text x="500" y="210" textAnchor="middle" className="text-[220px] font-black uppercase tracking-tighter" fill="black" style={{ letterSpacing: "-0.05em" }}>
                  ELEVATED
                </text>
                <text x="500" y="390" textAnchor="middle" className="text-[220px] font-black uppercase tracking-tighter italic" fill="black" style={{ letterSpacing: "-0.05em" }}>
                  MOBILITY.
                </text>
              </mask>
            </defs>
            <rect
              width="1000"
              height="500"
              fill={isDark ? "#121212" : "#efe9df"}
              fillOpacity="1"
              mask="url(#heroInversionMask)"
            />
          </svg>
        </div>

        <div className="relative z-30 px-8 md:px-24 w-full max-w-7xl h-full flex flex-col md:flex-row items-center justify-between pt-20">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-12">
            <div
              className="nm-inset inline-flex items-center gap-3 px-6 py-2 backdrop-blur-xl"
              style={{
                backgroundColor: isDark ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.45)",
              }}
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_15px_#E60000]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]" style={{ color: isDark ? "#a1a1a1" : "#5b5048" }}>
                Live Bazaar Operations · Meru
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 mt-64">
              <button
                onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full md:w-auto nm-card bg-primary text-white px-14 py-6 font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-transform border-none"
                style={{ boxShadow: "0 14px 28px rgba(230,0,0,0.22)" }}
              >
                Explore Inventory
              </button>
              <Link
                href="/marketplace"
                className="w-full md:w-auto nm-card px-14 py-6 font-black uppercase text-xs tracking-[0.2em] transition-all border-none backdrop-blur-md"
                style={{
                  backgroundColor: isDark ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.72)",
                  color: "var(--foreground)",
                  boxShadow: isDark ? "0 12px 24px rgba(0,0,0,0.25)" : "0 12px 24px rgba(31,26,23,0.08)",
                }}
              >
                The Marketplace
              </Link>
              <Link
                href="/staff/login"
                className="w-full md:w-auto nm-card px-14 py-6 font-black uppercase text-xs tracking-[0.2em] transition-all border backdrop-blur-md flex items-center justify-center gap-2"
                style={{
                  backgroundColor: isDark ? "rgba(24,24,27,0.80)" : "rgba(255,255,255,0.72)",
                  color: "var(--foreground)",
                  borderColor: isDark ? "rgba(230,0,0,0.30)" : "rgba(230,0,0,0.20)",
                  boxShadow: isDark ? "0 12px 24px rgba(0,0,0,0.25)" : "0 12px 24px rgba(31,26,23,0.08)",
                }}
              >
                <span className="material-symbols-outlined text-sm">terminal</span>
                Staff Terminal
              </Link>
            </div>
          </div>

          <div
            className="hidden lg:block w-[400px] nm-card backdrop-blur-2xl p-10 rounded-[2.5rem] space-y-8 animate-fade-in-up"
            style={{
              animationDelay: "0.5s",
              backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.55)",
              borderColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)",
              color: "var(--foreground)",
            }}
          >
            <div className="flex justify-between items-start">
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Mission Briefing</p>
              <span className="material-symbols-outlined text-sm" style={{ color: isDark ? "#52525b" : "#5b5048" }}>
                info
              </span>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic">
                THE CARFLEX <br />
                <span className="text-stroke">ECOSYSTEM.</span>
              </h3>
              <p className="text-[11px] font-bold leading-relaxed uppercase tracking-widest" style={{ color: isDark ? "#a1a1a1" : "#5b5048" }}>
                We are defining the next generation of high-trust automotive trade. From direct Japan sourcing to forensic vehicle verification, our platform empowers you to execute missions with total tactical certainty.
              </p>
            </div>

            <div className="pt-8 border-t grid grid-cols-2 gap-6" style={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)" }}>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: isDark ? "#737373" : "#6b5e54" }}>
                  Active Assets
                </p>
                <p className="text-lg font-black italic" style={{ color: "var(--foreground)" }}>
                  250+
                </p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest mb-1" style={{ color: isDark ? "#737373" : "#6b5e54" }}>
                  Authorized Hubs
                </p>
                <p className="text-lg font-black italic" style={{ color: "var(--foreground)" }}>
                  12 LOC
                </p>
              </div>
            </div>

            <Link href="/about" className="flex items-center gap-4 group pt-4">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] group-hover:text-primary transition-colors">
                Read Manifesto
              </span>
              <span
                className="w-8 h-[1px] group-hover:w-12 transition-all"
                style={{ backgroundColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)" }}
              />
              <span className="material-symbols-outlined text-sm text-primary">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 z-30">
          <div
            className="w-[1px] h-20"
            style={{
              backgroundImage: isDark
                ? "linear-gradient(to bottom, transparent, rgba(255,255,255,0.9), transparent)"
                : "linear-gradient(to bottom, transparent, rgba(31,26,23,0.75), transparent)",
            }}
          />
          <span className="text-[8px] uppercase tracking-[0.5em] font-bold">Scroll</span>
        </div>
      </section>

      <div
        className="py-20 backdrop-blur-sm overflow-hidden"
        style={{
          borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.08)",
          borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.08)",
          backgroundColor: isDark ? "rgba(0,0,0,0.20)" : "rgba(255,255,255,0.30)",
        }}
      >
        <div className="flex animate-marquee whitespace-nowrap gap-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-20 items-center text-4xl md:text-6xl font-black uppercase italic opacity-20">
              <span className="text-stroke">95% Verified</span>
              <span className="text-primary">Direct Japan Sourcing</span>
              <span className="text-stroke">Live Auction Access</span>
              <span style={{ color: "var(--foreground)" }}>Meru Showground</span>
            </div>
          ))}
        </div>
      </div>

      <main id="gallery" className="relative py-32">
        <LiveGallery />
      </main>

      <section className="py-40 px-8 relative">
        <div className="max-w-7xl mx-auto nm-card p-12 md:p-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center overflow-hidden">
          <div className="space-y-8 md:space-y-10 relative z-10">
            <div className="nm-inset inline-block px-6 py-2 text-primary font-black uppercase text-[10px] tracking-widest">
              Carflex College
            </div>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.82]">
              The Art of <br />
              <span
                className="italic"
                style={{
                  color: isDark ? "transparent" : "rgba(31,26,23,0.10)",
                  WebkitTextStroke: isDark ? "1px rgba(255,255,255,0.12)" : "1px rgba(31,26,23,0.14)",
                }}
              >
                Trading.
              </span>
            </h2>
            <p className="text-base md:text-lg font-medium max-w-md leading-relaxed pt-2" style={{ color: isDark ? "#a1a1a1" : "#5b5048" }}>
              Master vehicle inspection, digital sales, and global logistics. Join the elite network of Carflex Agents.
            </p>
            <button
              onClick={() => setIsWaitlistOpen(true)}
              className="nm-card px-12 py-5 font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all"
              style={{ backgroundColor: isDark ? "white" : "#1f1a17", color: isDark ? "#000" : "#f8f5ef" }}
            >
              Request Enrollment
            </button>
          </div>
          <div className="relative">
            <div className="aspect-square nm-inset overflow-hidden rounded-[2.5rem] max-w-[340px] mx-auto">
              <img
                src="/meru_10th_2026.jpg"
                alt="Carflex College Training"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000 opacity-95"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/15 blur-3xl rounded-full" />
          </div>
        </div>
      </section>

      <footer className="py-20 text-center opacity-30 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4">Carflex Ecosystem © 2026</p>
        <div className="flex justify-center gap-8 text-[8px] font-bold uppercase tracking-widest">
          <Link href="/support" className="hover:text-primary transition-colors">
            Support
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy
          </Link>
        </div>
      </footer>

      <CollegeWaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  );
}
