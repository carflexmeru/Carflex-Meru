"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AgentLayoutProps {
  children: React.ReactNode;
  agentName: string;
  primaryAction: string;
  onAction: () => void;
}

export default function AgentLayout({ children, agentName, primaryAction, onAction }: AgentLayoutProps) {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans text-white">
      {/* Top Header */}
      <header className="bg-[#0A0A0A] text-white px-8 py-6 flex justify-between items-center shadow-2xl z-20">
        <div className="flex items-center gap-4">
           <div className="w-8 h-8 bg-primary flex items-center justify-center font-black italic text-xs">CF</div>
           <div className="h-4 w-px bg-zinc-800"></div>
           <span className="text-[10px] font-black uppercase tracking-widest">{agentName}</span>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Sync Status</span>
           <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500 shadow-[0_0_10px_#22C55E]" : "bg-primary animate-pulse shadow-[0_0_10px_#E60000]"}`}></div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto pb-40">
        {children}
      </main>

      {/* Bottom Action Area */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-100 to-transparent z-20">
        <button 
          onClick={onAction}
          className="w-full bg-primary text-white py-8 rounded-none font-black uppercase tracking-[0.2em] text-sm shadow-[0_15px_50px_rgba(230,0,0,0.4)] active:scale-95 transition-all"
        >
          {primaryAction}
        </button>
        
        <div className="mt-4 flex justify-between px-2">
           <Link href="/staff/shift" className="text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">Shift Summary</Link>
           <button className="text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors">Report Issue</button>
        </div>
      </div>
    </div>
  );
}
