"use client";

import { useState } from "react";
import Link from "next/link";

export default function MeruEventTickets() {
  const [ticketType, setTicketType] = useState<string | null>(null);

  const passes = [
    { 
      id: "std", 
      name: "STANDARD PASS", 
      price: "500", 
      features: ["Single Day Entry", "The Yard Access", "Exhibitor Row Entry"] 
    },
    { 
      id: "vip", 
      name: "VIP COMMAND", 
      price: "2500", 
      features: ["4-Day Full Access", "VIP Lounge Node", "Early Entry Clearance", "Exclusive Preview Row"] 
    },
    { 
      id: "group", 
      name: "TACTICAL SQUAD", 
      price: "2000", 
      features: ["Entry for 5 Persons", "Group Identity Badge", "Standard Yard Access"] 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-24">
      <div className="flex flex-col gap-2 text-center items-center">
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Identity Clearance Registry</p>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">SECURE <br/> <span className="text-stroke italic">ACCESS.</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">Registration node for public tickets and exhibitor booth placement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
         {/* Public Tickets */}
         <div className="space-y-12">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-12 border-b border-white/5 pb-4">Public Pass Selection</h3>
            <div className="grid grid-cols-1 gap-8">
               {passes.map((pass) => (
                 <button 
                   key={pass.id}
                   onClick={() => setTicketType(pass.id)}
                   className={`nm-card p-10 flex flex-col md:flex-row justify-between items-center gap-8 transition-all text-left group ${ticketType === pass.id ? 'bg-primary border-none text-white' : 'hover:bg-white/5 border-none'}`}
                 >
                    <div className="space-y-4">
                       <h4 className="text-2xl font-black uppercase tracking-tighter italic">{pass.name}</h4>
                       <ul className="space-y-2">
                          {pass.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest opacity-60">
                               <span className="w-1 h-1 rounded-full bg-current"></span>
                               {f}
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div className="text-center md:text-right">
                       <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${ticketType === pass.id ? 'text-white/60' : 'text-zinc-500'}`}>Price Point</p>
                       <p className="text-4xl font-black tracking-tighter">KES {pass.price}</p>
                    </div>
                 </button>
               ))}
            </div>

            {ticketType && (
               <div className="nm-inset p-10 space-y-8 animate-fade-in">
                  <h4 className="text-lg font-black uppercase tracking-tight text-primary italic">FINALIZE GUEST IDENTITY</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="nm-card p-4 bg-black/20">
                        <input className="bg-transparent w-full font-black uppercase text-[10px] tracking-widest outline-none border-none" placeholder="FULL NAME" />
                     </div>
                     <div className="nm-card p-4 bg-black/20">
                        <input className="bg-transparent w-full font-black uppercase text-[10px] tracking-widest outline-none border-none" placeholder="PHONE NUMBER" />
                     </div>
                  </div>
                  <button className="w-full nm-card bg-primary text-white py-6 font-black uppercase tracking-[0.3em] text-[10px] shadow-[0_20px_40px_rgba(230,0,0,0.3)] hover:scale-105 active:scale-95 transition-all border-none">
                     AUTHORIZE TICKET ISSUANCE
                  </button>
               </div>
            )}
         </div>

         {/* Exhibitor Registration */}
         <div className="space-y-12">
            <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-12 border-b border-white/5 pb-4">Professional Exhibitors</h3>
            <div className="nm-card p-12 bg-primary/5 space-y-8 border border-primary/20 relative overflow-hidden group">
               <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[80px] rounded-full group-hover:scale-150 transition-all duration-700"></div>
               
               <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary text-4xl">storefront</span>
               </div>
               
               <div className="space-y-4">
                  <h4 className="text-4xl font-black uppercase tracking-tighter italic">EXHIBITOR <br/> <span className="text-stroke">COMMAND.</span></h4>
                  <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
                     Secure your strategic booth placement in the ASK Meru Main Arena. Register your tactical exhibitor node and deploy your asset manifest.
                  </p>
               </div>

               <div className="space-y-4 pt-8">
                  <div className="nm-inset p-6 flex justify-between items-center group/item hover:bg-white/5 transition-all">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Exhibitor Booth Pass</span>
                     <span className="text-xl font-black text-foreground">KES 15,000</span>
                  </div>
                  <div className="nm-inset p-6 flex justify-between items-center group/item hover:bg-white/5 transition-all">
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tactical Fleet Permit</span>
                     <span className="text-xl font-black text-foreground">INCLUDED</span>
                  </div>
               </div>

               <Link href="/vendor/login" className="block w-full nm-card bg-white text-black py-8 font-black uppercase tracking-[0.5em] text-[10px] text-center hover:bg-primary hover:text-white transition-all shadow-xl border-none">
                  INITIALIZE EXHIBITOR REGISTRY
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
