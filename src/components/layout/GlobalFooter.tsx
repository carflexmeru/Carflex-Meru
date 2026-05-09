"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function GlobalFooter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const syncTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDark(theme !== "light");
    };

    syncTheme();
    window.addEventListener("themechange", syncTheme);

    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

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
      title: "Tactical Hub",
      links: [
        { name: "Staff Terminal", href: "/staff/login" },
        { name: "Ground Feed", href: "/staff/ground" },
        { name: "Gate Control", href: "/staff/gate" },
        { name: "Intake Vault", href: "/staff/registration" },
      ]
    }
  ];

  return (
    <footer 
      className="border-t-8 border-primary pt-24 pb-12 transition-all duration-500"
      style={{
        backgroundColor: isDark ? '#0A0A0A' : '#f5f1eb',
        color: isDark ? 'white' : '#2a2420'
      }}
    >
      <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-20">
        
        {/* Brand & Newsletter */}
        <div className="md:col-span-2 space-y-12">
          <div className="flex items-center gap-4">
             <img src="/logo.png" alt="CARFLEX" className="w-20 h-auto object-contain" />
             <h2 className="text-4xl font-black uppercase tracking-tighter">Growth <span className="text-primary">Engine.</span></h2>
          </div>
          <p className="font-bold max-w-sm" style={{ color: isDark ? '#a1a1a1' : '#000000' }}>Capture the next bazaar. Subscribe to the Carflex DNA newsletter for live stock alerts and price drops.</p>
          
          <form onSubmit={handleSubscribe} className="flex max-w-md h-16">
             <input 
              required
              type="email" 
              placeholder="ENTER EMAIL ADDRESS"
              className="flex-1 border-2 px-6 font-bold outline-none focus:border-primary transition-all uppercase text-sm"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                color: isDark ? 'white' : '#2a2420'
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
             />
             <button 
              className={`px-10 font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2`}
              style={{
                backgroundColor: isSubscribed ? (isDark ? 'white' : '#2a2420') : '#E60000',
                color: isSubscribed ? (isDark ? 'black' : 'white') : 'white'
              }}
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
                  <Link 
                    href={link.href} 
                    className="text-sm font-black uppercase tracking-widest transition-colors"
                    style={{
                      color: isDark ? '#a1a1a1' : '#000000'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = isDark ? 'white' : '#E60000'}
                    onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#a1a1a1' : '#000000'}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div 
        className="max-w-7xl mx-auto px-12 mt-24 pt-12 border-t flex justify-between items-center"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)'
        }}
      >
         <p className="text-[8px] font-black uppercase tracking-widest" style={{ color: isDark ? '#4a4a4a' : '#000000' }}>© 2026 Carflex Marketplace. All Assets DNA Verified.</p>
         <button 
           className="p-4 rounded-full transition-all"
           style={{
             backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
             color: isDark ? '#a1a1a1' : '#000000'
           }}
           onMouseEnter={(e) => e.currentTarget.style.color = '#E60000'}
           onMouseLeave={(e) => e.currentTarget.style.color = isDark ? '#a1a1a1' : '#000000'}
         >
            <span className="material-symbols-outlined text-sm">support_agent</span>
         </button>
      </div>
    </footer>
  );
}
