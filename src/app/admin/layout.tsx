"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const adminNav = [
    { name: "Global Analytics", path: "/admin", icon: "monitoring" },
    { name: "Finance & Recon", path: "/admin/finance", icon: "account_balance" },
    { name: "Event Manager", path: "/admin/events", icon: "calendar_today" },
    { name: "System Monitor", path: "/admin/monitor", icon: "terminal" },
    { name: "Audit Logs", path: "/admin/audit", icon: "security" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-80 bg-[var(--sidebar)] text-[var(--foreground)] flex flex-col p-8 z-30 border-r border-[var(--glass-border)]">
        <div className="flex items-center gap-2 mb-16">
          <div className="w-8 h-8 bg-primary flex items-center justify-center font-black italic">CF</div>
          <span className="text-xl font-black uppercase tracking-tighter italic">Admin HQ</span>
        </div>

        <nav className="flex-1 space-y-2">
          {adminNav.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-4 px-6 py-4 font-black uppercase text-[10px] tracking-widest transition-all ${
                pathname === item.path 
                  ? "bg-primary text-white shadow-[0_0_20px_#E60000]" 
                  : "text-zinc-500 hover:text-foreground hover:bg-[var(--sidebar-hover)]"
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-[var(--glass-border)] space-y-4">
           <div className="bg-[var(--sidebar-hover)] p-4 rounded-none border border-[var(--glass-border)]">
              <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-1">System Load</p>
              <div className="h-1 bg-black/10 dark:bg-white/10 w-full">
                 <div className="h-1 bg-primary w-[32%]"></div>
              </div>
           </div>
           <Link href="/" className="flex items-center gap-4 px-6 py-4 font-black uppercase text-[10px] tracking-widest text-zinc-500 hover:text-foreground transition-all">
            <span className="material-symbols-outlined text-lg">logout</span>
            Exit Admin Hub
          </Link>
        </div>
      </aside>

      {/* Main Admin Canvas */}
      <main className="flex-1 min-h-screen bg-[var(--background)] relative">
        <header className="sticky top-0 bg-[var(--surface)]/95 backdrop-blur-xl border-b border-[var(--glass-border)] px-6 md:px-12 py-6 md:py-8 flex justify-between items-center z-20">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {adminNav.find(n => n.path === pathname)?.name || "Master Command"}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Database Live</span>
            </div>
            <div className="w-10 h-10 bg-[var(--sidebar)] text-white flex items-center justify-center border-2 border-primary">
               <span className="material-symbols-outlined">shield</span>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
