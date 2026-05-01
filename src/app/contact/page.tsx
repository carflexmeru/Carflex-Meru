"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-24">
      {/* Briefing Section */}
      <div className="space-y-12">
        <div className="flex flex-col gap-2">
           <p className="text-primary text-[10px] font-black uppercase tracking-[0.8em]">Communication Node</p>
           <h1 className="text-7xl font-black uppercase tracking-tighter leading-none italic">
             GET IN <br/> <span className="text-stroke">TOUCH.</span>
           </h1>
           <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-6 leading-loose">
             Initialize contact for high-stakes inquiries, partnerships, or technical support. Our command center is operational 24/7.
           </p>
        </div>

        <div className="space-y-8">
           <div className="flex items-center gap-6 group">
              <div className="nm-inset w-16 h-16 flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                 <span className="material-symbols-outlined">call</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Voice Terminal</p>
                 <p className="text-xl font-black text-white">+254 700 000 000</p>
              </div>
           </div>

           <div className="flex items-center gap-6 group">
              <div className="nm-inset w-16 h-16 flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                 <span className="material-symbols-outlined">alternate_email</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Uplink</p>
                 <p className="text-xl font-black text-white">ops@carflex.co.ke</p>
              </div>
           </div>

           <div className="flex items-center gap-6 group">
              <div className="nm-inset w-16 h-16 flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                 <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Headquarters</p>
                 <p className="text-xl font-black text-white italic">MERU, KENYA</p>
              </div>
           </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="nm-card p-12 relative overflow-hidden">
        {submitted ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-24 h-24 bg-primary flex items-center justify-center rounded-full shadow-[0_0_50px_rgba(230,0,0,0.5)]">
                <span className="material-symbols-outlined text-white text-5xl">check</span>
             </div>
             <h3 className="text-3xl font-black uppercase tracking-tighter italic">MISSION RECEIVED.</h3>
             <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Your inquiry has been successfully forensics-logged. Our command center will respond within 2 operational hours.
             </p>
          </div>
        ) : (
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Full Name</label>
               <input type="text" required placeholder="IDENTIFY YOURSELF" className="w-full nm-inset bg-transparent p-6 text-white font-bold outline-none border-none focus:ring-2 ring-primary/30" />
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Email Address</label>
                  <input type="email" required placeholder="DIGITAL UPLINK" className="w-full nm-inset bg-transparent p-6 text-white font-bold outline-none border-none focus:ring-2 ring-primary/30" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Inquiry Type</label>
                  <select className="w-full nm-inset bg-transparent p-6 text-white font-bold outline-none border-none focus:ring-2 ring-primary/30 uppercase text-xs">
                     <option>Vendor Partnership</option>
                     <option>Asset Inquiry</option>
                     <option>Technical Support</option>
                     <option>Event Management</option>
                  </select>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Message Content</label>
               <textarea rows={4} required placeholder="DESCRIBE THE MISSION..." className="w-full nm-inset bg-transparent p-6 text-white font-bold outline-none border-none focus:ring-2 ring-primary/30 resize-none"></textarea>
            </div>

            <button type="submit" className="w-full nm-card bg-primary text-white py-6 font-black uppercase tracking-[0.3em] text-xs shadow-[0_20px_50px_rgba(230,0,0,0.3)] hover:scale-[1.02] transition-all border-none">
               TRANSMIT INQUIRY
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
