"use client";

import Link from "next/link";
import { useState } from "react";

export default function GlobalFooter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const SECTIONS = [
    {
      title: "Bazaar Support",
      links: [
        { name: "Vendor KB", href: "/support/vendor-kb" },
        { name: "Buyer Safety", href: "/support/buyer-safety" },
        { name: "Staff Academy", href: "/support/staff-training" },
        { name: "FAQs", href: "/faq" },
      ]
    },
    {
      title: "Legal & DNA",
      links: [
        { name: "Bazaar Terms", href: "/support/legal" },
        { name: "Privacy Policy", href: "/support/legal" },
        { name: "Vehicle Verification", href: "/college" },
        { name: "Contact Hub", href: "/garage" },
      ]
    }
  ];

  return (
    <footer className="bg-[#0A0A0A] border-t-8 border-primary pt-24 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-20">
        
        {/* Brand & Newsletter */}
        <div className="md:col-span-2 space-y-12">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-primary flex items-center justify-center font-black italic text-xl">CF</div>
             <h2 className="text-4xl font-black uppercase tracking-tighter">Growth <span className="text-primary">Engine.</span></h2>
          </div>
          <p className="text-zinc-500 font-bold max-w-sm">Capture the next bazaar. Subscribe to the Carflex DNA newsletter for live stock alerts and price drops.</p>
          
          <form onSubmit={handleSubscribe} className="flex max-w-md h-16">
             <input 
              required
              type="email" 
              placeholder="ENTER EMAIL ADDRESS"
              className="flex-1 bg-white/5 border-2 border-white/10 px-6 font-bold outline-none focus:border-primary transition-all uppercase text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
             />
             <button 
              className={`px-10 font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 ${
                isSubscribed ? "bg-white text-black" : "bg-primary text-white hover:bg-white hover:text-black"
              }`}
             >
                {isSubscribed ? (
                  <><span className="material-symbols-outlined text-sm">check</span> Subscribed</>
                ) : "Subscribe"}
             </button>
          </form>
        </div>

        {/* Links */}
        {SECTIONS.map((s) => (
          <div key={s.title} className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{s.title}</h4>
            <ul className="space-y-4">
              {s.links.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-12 mt-24 pt-12 border-t border-white/5 flex justify-between items-center">
         <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700">© 2026 Carflex Marketplace. All Assets DNA Verified.</p>
         <button className="bg-white/5 p-4 rounded-full text-zinc-400 hover:text-primary transition-all">
            <span className="material-symbols-outlined text-sm">support_agent</span>
         </button>
      </div>
    </footer>
  );
}
