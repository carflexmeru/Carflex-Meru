"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import LiveGallery from "@/components/LiveGallery";
import CollegeWaitlistModal from "@/components/CollegeWaitlistModal";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function LandingPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Native Video Loop handled via HTML5 Video attributes. No YouTube API needed.

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white overflow-x-hidden">
      
      {/* Liquid Background */}
      <div className="liquid-bg">
        <div className="liquid-blob" style={{ top: '10%', left: '10%', animationDelay: '0s' }}></div>
        <div className="liquid-blob" style={{ bottom: '10%', right: '10%', animationDelay: '-5s', background: 'rgba(255,255,255,0.05)' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
        
        {/* FULLSCREEN NATIVE VIDEO BACKGROUND */}
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
           <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* INVERTED MASK OVERLAY */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none select-none flex items-center justify-center transition-transform duration-75"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
           <svg viewBox="0 0 1000 500" className="w-full h-full">
              <defs>
                 <mask id="heroInversionMask">
                    <rect width="1000" height="500" fill="white" />
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
              <rect width="1000" height="500" fill="#121212" fillOpacity="1" mask="url(#heroInversionMask)" />
           </svg>
        </div>

        {/* CONTENT LAYER */}
        <div 
          className="relative z-30 px-8 md:px-24 w-full max-w-7xl h-full flex flex-col md:flex-row items-center justify-between pt-20"
        >
          {/* Left Flank: Primary Commands */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-12">
            <div className="nm-inset inline-flex items-center gap-3 px-6 py-2 bg-black/40 backdrop-blur-xl">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_15px_#E60000]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Live Bazaar Operations • Meru</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 mt-64">
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

          {/* Right Flank: Glassmorphic Mission Briefing Card */}
          <div 
            className="hidden lg:block w-[400px] nm-card bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] space-y-8 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
             <div className="flex justify-between items-start">
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Mission Briefing</p>
                <span className="material-symbols-outlined text-zinc-600 text-sm">info</span>
             </div>

             <div className="space-y-6">
                <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic">
                  THE CARFLEX <br/> <span className="text-stroke">ECOSYSTEM.</span>
                </h3>
                <p className="text-zinc-400 text-[11px] font-bold leading-relaxed uppercase tracking-widest">
                  We are defining the next generation of high-trust automotive trade. From direct Japan sourcing to forensic vehicle verification, our platform empowers you to execute missions with total tactical certainty.
                </p>
             </div>

             <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                <div>
                   <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Active Assets</p>
                   <p className="text-lg font-black text-white italic">250+</p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Authorized Hubs</p>
                   <p className="text-lg font-black text-white italic">12 LOC</p>
                </div>
             </div>

             <Link href="/about" className="flex items-center gap-4 group pt-4">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] group-hover:text-primary transition-colors">Read Manifesto</span>
                <span className="w-8 h-[1px] bg-white/10 group-hover:w-12 transition-all"></span>
                <span className="material-symbols-outlined text-sm text-primary">arrow_forward</span>
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

      <main id="gallery" className="relative py-32">
        <LiveGallery />
      </main>

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
             <div className="aspect-square nm-inset overflow-hidden rounded-[2.5rem]">
                <img 
                  src="/event assets/IMG-20260428-WA0003.jpg" 
                  alt="Carflex College Training" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000 grayscale opacity-80 mix-blend-luminosity" 
                />
             </div>
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full"></div>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center opacity-30 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4">Carflex Ecosystem © 2026</p>
        <div className="flex justify-center gap-8 text-[8px] font-bold uppercase tracking-widest">
           <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
           <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
           <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
        </div>
      </footer>

      <CollegeWaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
    </div>
  );
}
