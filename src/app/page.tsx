"use client";

import React, { useState } from "react";
import Link from "next/link";
import LiveGallery from "@/components/LiveGallery";
import NewsletterForm from "@/components/NewsletterForm";
import CollegeWaitlistModal from "@/components/CollegeWaitlistModal";

export default function LandingPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] opacity-10 blur-3xl animate-pulse">
           <div className="w-full h-full bg-primary rounded-full"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Meru Showground — Live Operations</span>
          </div>

          <h1 className="text-[12vw] md:text-[10vw] font-black leading-[0.8] uppercase tracking-tighter mb-12 animate-scale-up">
            The Carflex <br/>
            <span className="text-primary italic">Bazaar.</span>
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full md:w-auto bg-white text-black px-12 py-6 font-black uppercase text-sm tracking-widest hover:bg-primary hover:text-white transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
              Browse Inventory
            </button>
            <Link href="/import-tracker" className="w-full md:w-auto px-12 py-6 font-black uppercase text-sm tracking-widest border-2 border-white/10 hover:border-primary transition-all">
              Track Import
            </Link>
          </div>
        </div>

        {/* Floating Marquee Stats */}
        <div className="absolute bottom-12 w-full overflow-hidden whitespace-nowrap opacity-20 border-y border-white/5 py-4">
          <div className="flex animate-marquee gap-24">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-24 font-black uppercase italic tracking-[0.5em] text-4xl">
                <span>95% verified inventory</span>
                <span className="text-primary">Live Auction Bidding</span>
                <span>Japan Direct Sourcing</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Bazaar Hub */}
      <main id="gallery" className="bg-[#0a0a0a] border-t border-white/10">
        <LiveGallery />
      </main>

      {/* Training Pillar Section */}
      <section className="py-32 px-8 bg-white text-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <div className="inline-block bg-black text-white px-6 py-2 font-black uppercase text-[10px] tracking-widest">Carflex College</div>
            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              Master the <br/> <span className="text-primary italic">Trade.</span>
            </h2>
            <p className="text-xl font-bold text-zinc-500 max-w-md leading-tight">
              Certified training in Vehicle Inspection, Digital Sales, and Export Logistics. Become a Carflex Agent.
            </p>
            <button 
              onClick={() => setIsWaitlistOpen(true)}
              className="bg-[#0a0a0a] text-white px-10 py-5 font-black uppercase text-xs tracking-widest hover:bg-primary transition-all"
            >
              Join Training Waitlist
            </button>
          </div>
          <div className="aspect-square bg-zinc-100 border-4 border-black relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <span className="material-symbols-outlined text-[200px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">school</span>
          </div>
        </div>
      </section>


      {/* Modals */}
      <CollegeWaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />

    </div>
  );
}
