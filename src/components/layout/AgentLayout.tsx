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
    <div className="min-h-screen bg-[#080808] flex flex-col font-sans text-white overflow-hidden relative">
      {/* Liquid Background */}
      <div className="liquid-bg opacity-50">
        <div className="liquid-blob" style={{ top: '0%', right: '0%', width: '40vw', height: '40vw' }}></div>
      </div>

      {/* Top Header */}
      <header className="px-8 py-6 flex justify-between items-center z-20 relative">
        <div className="nm-inset flex items-center gap-4 px-6 py-3">
           <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-black italic text-xs shadow-[0_0_15px_#E60000]">CF</div>
           <div className="h-4 w-px bg-zinc-800"></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{agentName}</span>
        </div>
        <div className="nm-inset flex items-center gap-3 px-6 py-3">
           <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Mainframe Link</span>
           <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500 shadow-[0_0_10px_#22C55E]" : "bg-primary animate-pulse shadow-[0_0_10px_#E60000]"}`}></div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto pb-48 relative z-10 px-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Action Area */}
      <div className="fixed bottom-0 left-0 right-0 p-8 z-20">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={onAction}
            className="nm-card w-full bg-primary text-white py-10 font-black uppercase tracking-[0.3em] text-sm shadow-[0_20px_40px_rgba(230,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all border-none"
          >
            {primaryAction}
          </button>
          
          <div className="mt-8 flex justify-center gap-12 px-2">
             <Link href="/staff/shift" className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Shift Analysis</Link>
             <button className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors">Emergency Comms</button>
          </div>
        </div>
      </div>
    </div>
  );
}
