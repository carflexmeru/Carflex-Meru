import React from "react";

export default function GateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* Staff Header */}
      <header className="px-6 py-4 glass-morphism flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center font-black text-black">
            CF
          </div>
          <div>
            <h1 className="text-white font-bold text-sm tracking-tight">CARFLEX GROUND STAFF</h1>
            <p className="text-primary text-[10px] font-bold uppercase tracking-widest">Agent 1: Gate Check-in</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-white text-xs font-medium">Meru Showground</p>
            <p className="text-zinc-500 text-[10px]">Active Shift: 08:00 - 18:00</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 text-xs">
            JD
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* Quick Action Footer for Mobile */}
      <footer className="sm:hidden glass-morphism p-4 sticky bottom-0 flex justify-around items-center">
        <div className="flex flex-col items-center gap-1 text-primary">
          <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          </div>
          <span className="text-[10px] font-bold uppercase">Check-in</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-zinc-500">
          <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center" />
          <span className="text-[10px] font-bold uppercase">Reports</span>
        </div>
      </footer>
    </div>
  );
}
