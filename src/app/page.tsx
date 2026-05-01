"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import LiveGallery from "@/components/LiveGallery";
import CollegeWaitlistModal from "@/components/CollegeWaitlistModal";

export default function LandingPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white overflow-x-hidden">
      
      {/* Liquid Background */}
      <div className="liquid-bg">
        <div className="liquid-blob" style={{ top: '10%', left: '10%', animationDelay: '0s' }}></div>
        <div className="liquid-blob" style={{ bottom: '10%', right: '10%', animationDelay: '-5s', background: 'rgba(255,255,255,0.05)' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        <div 
          className="relative z-10 text-center px-6 w-full max-w-7xl transition-transform duration-75"
          style={{ transform: `translateY(${scrollY * 0.25}px)` }}
        >
          <div className="nm-inset inline-flex items-center gap-3 px-6 py-2 mb-12">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_15px_#E60000]"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Live Bazaar Operations • Meru</span>
          </div>

          {/* Premium Unified Video Mask */}
          <div className="relative w-full h-[30vh] md:h-[45vh] flex items-center justify-center mb-12">
             <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-30">
               <defs>
                 <mask id="textMask" x="0" y="0" width="100%" height="100%">
                    <rect width="100%" height="100%" fill="black" />
                    <text 
                      x="50%" 
                      y="40%" 
                      textAnchor="middle" 
                      className="text-[18vw] md:text-[12vw] font-black uppercase tracking-tighter" 
                      fill="white"
                    >
                      ELEVATED
                    </text>
                    <text 
                      x="50%" 
                      y="85%" 
                      textAnchor="middle" 
                      className="text-[18vw] md:text-[12vw] font-black uppercase tracking-tighter italic" 
                      fill="white"
                    >
                      MOBILITY.
                    </text>
                 </mask>
               </defs>
               {/* Decorative Glow Behind the Mask */}
               <rect width="100%" height="100%" fill="none" className="filter blur-3xl opacity-20" mask="url(#textMask)" />
             </svg>

             {/* The Video Source */}
             <div className="absolute inset-0 z-20" style={{ maskImage: 'url(#textMask)', WebkitMaskImage: 'url(#textMask)' }}>
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                <iframe 
                   className="w-[110vw] h-[110vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-110 object-cover pointer-events-none"
                   src="https://www.youtube.com/embed/vTErTWxtxO4?autoplay=1&mute=1&loop=1&playlist=vTErTWxtxO4&controls=0&modestbranding=1&showinfo=0&rel=0&start=180" 
                   frameBorder="0" 
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
             </div>

             {/* Tactical Underlay (Ensures readability if video is slow) */}
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center opacity-10">
                <p className="text-[18vw] md:text-[12vw] font-black uppercase tracking-tighter leading-none">ELEVATED</p>
                <p className="text-[18vw] md:text-[12vw] font-black uppercase tracking-tighter leading-none italic">MOBILITY.</p>
             </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-16">
            <button 
              onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full md:w-auto nm-card bg-primary text-white px-14 py-6 font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-transform border-none shadow-[0_20px_50px_rgba(230,0,0,0.3)]"
            >
              Explore Inventory
            </button>
            <Link href="/marketplace" className="w-full md:w-auto nm-card bg-transparent border border-white/5 px-14 py-6 font-black uppercase text-xs tracking-[0.2em] hover:bg-white/5 transition-all">
              The Marketplace
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
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
