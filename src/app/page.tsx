"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import LiveGallery from "@/components/LiveGallery";
import CollegeWaitlistModal from "@/components/CollegeWaitlistModal";

export default function LandingPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // YouTube Loop Sentinel (Force reset to 3 mins)
  useEffect(() => {
    const interval = setInterval(() => {
      if (iframeRef.current) {
        // Simple reload strategy if video ends (Youtube doesn't easily loop segments via URL)
        // For a more robust solution, Youtube Iframe API would be used.
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white overflow-x-hidden">
      
      {/* Liquid Background */}
      <div className="liquid-bg">
        <div className="liquid-blob" style={{ top: '10%', left: '10%', animationDelay: '0s' }}></div>
        <div className="liquid-blob" style={{ bottom: '10%', right: '10%', animationDelay: '-5s', background: 'rgba(255,255,255,0.05)' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
        
        {/* FULLSCREEN VIDEO BACKGROUND */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none">
           <iframe 
              ref={iframeRef}
              className="w-[120vw] h-[120vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-125 object-cover"
              src="https://www.youtube.com/embed/vTErTWxtxO4?autoplay=1&mute=1&loop=1&playlist=vTErTWxtxO4&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&start=180" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           ></iframe>
        </div>

        {/* INVERTED MASK OVERLAY (Reduced Opacity Grey Section) */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none select-none flex items-center justify-center transition-transform duration-75"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
           <svg viewBox="0 0 1000 500" className="w-full h-full">
              <defs>
                 <mask id="heroInversionMask">
                    <rect width="1000" height="500" fill="white" />
                    {/* Artistically Compressed Typography */}
                    <text 
                      x="500" 
                      y="210" 
                      textAnchor="middle" 
                      className="text-[220px] font-black uppercase tracking-tighter" 
                      fill="black"
                      style={{ letterSpacing: '-0.05em' }}
                    >
                      ELEVATED
                    </text>
                    <text 
                      x="500" 
                      y="390" 
                      textAnchor="middle" 
                      className="text-[220px] font-black uppercase tracking-tighter italic" 
                      fill="black"
                      style={{ letterSpacing: '-0.05em' }}
                    >
                      MOBILITY.
                    </text>
                 </mask>
              </defs>
              {/* Darkened Tactical Grey Overlay (92% Opacity) */}
              <rect width="1000" height="500" fill="#121212" fillOpacity="0.92" mask="url(#heroInversionMask)" />
           </svg>
        </div>

        {/* CONTENT LAYER */}
        <div 
          className="relative z-30 text-center px-6 w-full max-w-7xl pt-20"
        >
          <div className="nm-inset inline-flex items-center gap-3 px-6 py-2 mb-12 bg-black/40 backdrop-blur-xl">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_15px_#E60000]"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Live Bazaar Operations • Meru</span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-64">
            <button 
              onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full md:w-auto nm-card bg-primary text-white px-14 py-6 font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-transform border-none shadow-[0_20px_50px_rgba(230,0,0,0.3)]"
            >
              Explore Inventory
            </button>
            <Link href="/marketplace" className="w-full md:w-auto nm-card bg-black/60 text-white px-14 py-6 font-black uppercase text-xs tracking-[0.2em] hover:bg-zinc-800 transition-all border-none backdrop-blur-md">
              The Marketplace
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 z-30">
          <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <span className="text-[8px] uppercase tracking-[0.5em] font-bold">Scroll</span>
        </div>
      </section>

      {/* Stats Loop */}
      <div className="py-20 border-y border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-20">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-20 items-center text-4xl md:text-6xl font-black uppercase italic opacity-20">
              <span className="text-stroke">95% Verified</span>
              <span className="text-primary">Direct Japan Sourcing</span>
              <span className="text-stroke">Live Auction Access</span>
              <span className="text-white">Meru Showground</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Bazaar Hub */}
      <main id="gallery" className="relative py-32">
        <LiveGallery />
      </main>

      {/* Training Pillar Section */}
      <section className="py-40 px-8 relative">
        <div className="max-w-7xl mx-auto nm-card p-12 md:p-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center overflow-hidden">
          <div className="space-y-10 relative z-10">
            <div className="nm-inset inline-block px-6 py-2 text-primary font-black uppercase text-[10px] tracking-widest">Carflex College</div>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
              The Art of <br/> <span className="text-stroke italic">Trading.</span>
            </h2>
            <p className="text-lg font-medium text-zinc-500 max-w-md leading-relaxed">
              Master vehicle inspection, digital sales, and global logistics. Join the elite network of Carflex Agents.
            </p>
            <button 
              onClick={() => setIsWaitlistOpen(true)}
              className="nm-card bg-white text-black px-12 py-5 font-black uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              Request Enrollment
            </button>
          </div>
          <div className="relative">
             <div className="aspect-square nm-inset flex items-center justify-center">
                <span className="material-symbols-outlined text-[120px] md:text-[200px] opacity-10 animate-pulse">school</span>
             </div>
             {/* Decorative Accents */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="py-20 text-center opacity-30 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4">Carflex Ecosystem © 2026</p>
        <div className="flex justify-center gap-8 text-[8px] font-bold uppercase tracking-widest">
           <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
           <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
           <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
        </div>
      </footer>

      {/* Modals */}
      <CollegeWaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  );
}
