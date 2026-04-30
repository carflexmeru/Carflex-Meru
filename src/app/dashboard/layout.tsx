"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: "dashboard" },
    { name: "My Bargains", path: "/inbox", icon: "forum" },
    { name: "Transactions", path: "/dashboard/transactions", icon: "receipt_long" },
    { name: "Settings", path: "/dashboard/settings", icon: "settings" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-[#0A0A0A] text-white flex flex-col p-8 z-30">
        <div className="flex items-center gap-2 mb-16">
          <div className="w-8 h-8 bg-primary flex items-center justify-center font-black italic">CF</div>
          <span className="text-xl font-black uppercase tracking-tighter italic">Command Hub</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 px-6 py-4 font-black uppercase text-[10px] tracking-widest transition-all ${
                pathname === item.path 
                  ? "bg-primary text-white" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5">
          <Link href="/" className="flex items-center gap-4 px-6 py-4 font-black uppercase text-[10px] tracking-widest text-zinc-500 hover:text-white transition-all">
            <span className="material-symbols-outlined text-lg">logout</span>
            Back to Bazaar
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen relative">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-12 py-8 flex justify-between items-center z-20">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {navItems.find(n => n.path === pathname)?.name || "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Authenticated as</p>
              <p className="font-bold text-sm">+254 700 000 000</p>
            </div>
            <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center border-2 border-zinc-200">
               <span className="material-symbols-outlined">person</span>
            </div>
          </div>
        </header>

        <div className="p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
