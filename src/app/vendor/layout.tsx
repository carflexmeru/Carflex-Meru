"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"obsidian" | "frost">("obsidian");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to login if not authenticated (simplified for now)
  useEffect(() => {
    const phone = sessionStorage.getItem("vendor_phone");
    if (!phone && !pathname.includes("/login") && !pathname.includes("/onboarding")) {
      router.push("/vendor/login");
    }
  }, [pathname, router]);

  const navItems = [
    { label: "Overview", href: "/vendor/dashboard", icon: "dashboard" },
    { label: "My Listings", href: "/vendor/listings", icon: "directions_car" },
    { label: "Transactions", href: "/vendor/transactions", icon: "payments" },
    { label: "Messages", href: "/vendor/messages", icon: "chat_bubble" },
    { label: "Activity Logs", href: "/vendor/logs", icon: "history" },
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/vendor/login");
  };

  // Skip layout for login and onboarding
  if (pathname.includes("/login") || pathname.includes("/onboarding")) {
    return <>{children}</>;
  }

  return (
    <div className={`min-h-screen flex transition-colors duration-500 ${theme === "obsidian" ? "bg-[#050505] text-white" : "bg-[#F0F2F5] text-[#1A1A1A]"}`} data-theme={theme}>
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 transition-all duration-500 border-r ${theme === "obsidian" ? "bg-[#080808] border-white/5" : "bg-white border-black/5"} ${isSidebarOpen ? "w-80" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_10px_20px_rgba(230,0,0,0.3)]">
              <span className="material-symbols-outlined text-white">storefront</span>
            </div>
            {isSidebarOpen && (
              <h2 className="text-xl font-black uppercase tracking-tighter italic">VENDOR<span className="text-primary">DECK</span></h2>
            )}
          </div>

          <nav className="flex-1 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${pathname === item.href ? (theme === "obsidian" ? "bg-primary text-white shadow-[0_15px_30px_rgba(230,0,0,0.2)]" : "bg-primary text-white shadow-[0_15px_30px_rgba(230,0,0,0.1)]") : (theme === "obsidian" ? "hover:bg-white/5 text-zinc-500 hover:text-white" : "hover:bg-black/5 text-zinc-400 hover:text-black")}`}
              >
                <span className={`material-symbols-outlined transition-transform duration-500 group-hover:scale-110 ${pathname === item.href ? "text-white" : "text-zinc-500"}`}>{item.icon}</span>
                {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/5 space-y-4">
             {/* Theme Toggle */}
             <button 
                onClick={() => setTheme(theme === "obsidian" ? "frost" : "obsidian")}
                className="w-full nm-inset p-4 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest"
             >
                <span className="material-symbols-outlined text-sm">{theme === "obsidian" ? "light_mode" : "dark_mode"}</span>
                {isSidebarOpen && <span>Switch to {theme === "obsidian" ? "Frost" : "Obsidian"}</span>}
             </button>

             <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 text-zinc-500 hover:text-primary transition-all"
             >
                <span className="material-symbols-outlined">logout</span>
                {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>}
             </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 min-h-screen overflow-auto relative">
         {/* Top Bar (Mobile Only) */}
         <header className="lg:hidden p-6 flex justify-between items-center border-b border-white/5 sticky top-0 z-40 backdrop-blur-md">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="nm-card p-3">
               <span className="material-symbols-outlined">{isSidebarOpen ? "close" : "menu"}</span>
            </button>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <span className="material-symbols-outlined text-white text-sm">storefront</span>
            </div>
         </header>

         <div className="p-8 lg:p-16 max-w-[1600px] mx-auto animate-fade-in">
            {children}
         </div>
      </main>
    </div>
  );
}
