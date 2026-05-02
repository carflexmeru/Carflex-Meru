"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const supportNav = [
    { name: "Vendor KB", path: "/support/vendor-kb", icon: "book_2" },
    { name: "Buyer Safety", path: "/support/buyer-safety", icon: "security" },
    { name: "Staff Training", path: "/support/staff-training", icon: "school" },
    { name: "Legal & Terms", path: "/support/legal", icon: "gavel" },
    { name: "FAQs", path: "/faq", icon: "help" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans flex flex-col">
      {/* Support Header */}
      <nav className="bg-[#0A0A0A] text-white px-12 py-8 flex flex-col md:flex-row justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2 mb-6 md:mb-0">
          <img src="/logo.png" alt="CARFLEX" className="w-8 h-auto object-contain" />
          <span className="text-xl font-black uppercase tracking-tighter">Support <span className="text-primary italic">Pillar</span></span>
        </div>
        <div className="flex gap-8 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 no-scrollbar">
          {supportNav.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all ${
                pathname === item.path ? "text-primary border-b-2 border-primary pb-2" : "text-zinc-500 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Content Canvas */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-8 py-24">
        {children}
      </main>

      {/* Support Footer */}
      <footer className="bg-zinc-50 border-t border-zinc-100 py-12 px-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Need direct intervention?</p>
        <button className="mt-4 bg-black text-white px-10 py-4 font-black uppercase text-xs tracking-widest hover:bg-primary transition-all">
          Contact Support Agent
        </button>
      </footer>
    </div>
  );
}
