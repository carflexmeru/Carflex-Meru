"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function CommandSidebar({ role = "admin" }: { role?: "admin" | "vendor" | "buyer" }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);

  const MENU = role === "admin" ? [
    { name: "Analytics", icon: "analytics", href: "/admin" },
    { name: "Finance", icon: "payments", href: "/admin/finance" },
    { name: "Events", icon: "event", href: "/admin/events" },
    { name: "Monitor", icon: "monitoring", href: "/admin/monitor" },
    { name: "Audit", icon: "history", href: "/admin/audit" },
  ] : role === "vendor" ? [
    { name: "My Showroom", icon: "garage", href: "/vendor/listings" },
    { name: "Lead Channels", icon: "chat_bubble", href: "/vendor/messages" },
    { name: "Bazaar Stats", icon: "trending_up", href: "/vendor/dashboard" },
    { name: "Account Settings", icon: "settings", href: "/vendor/settings" },
  ] : [
    { name: "My Dashboard", icon: "dashboard", href: "/buyer" },
    { name: "Inquiries", icon: "chat", href: "/buyer/messages" },
    { name: "Liked Assets", icon: "favorite", href: "/buyer/liked" },
    { name: "Transactions", icon: "receipt_long", href: "/buyer/transactions" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-80 h-screen sticky top-0 bg-[#0A0A0A] border-r border-white/5 text-white">
      <div className="p-12">
        <Link href="/" className="flex items-center gap-3 mb-20">
          <div className="w-10 h-10 bg-primary flex items-center justify-center font-black italic">CF</div>
          <span className="text-xl font-black uppercase tracking-tighter">Command <span className="text-primary italic">HQ.</span></span>
        </Link>

        <nav className="space-y-4">
          {MENU.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 group ${
                  isActive 
                    ? "bg-primary text-white font-black" 
                    : "text-zinc-500 hover:text-primary"
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${isActive ? "text-white" : "group-hover:text-primary"}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                {isActive && <div className="ml-auto w-1 h-4 bg-white/20"></div>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-12 space-y-4 border-t border-white/5">
        {role === "admin" ? (
          <button className="w-full bg-primary text-white py-4 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">
            Broadcast Alert
          </button>
        ) : (
          <button className="w-full border-2 border-primary text-primary py-4 font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all">
            Exit Bazaar
          </button>
        )}
        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 text-center">Meru Showground | CF-DNA-V1</p>
      </div>
    </aside>
  );
}
