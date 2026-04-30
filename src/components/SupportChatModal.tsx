"use client";

import { useState } from "react";

export default function SupportChatModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [msg, setMsg] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] w-full max-w-sm">
      <div className="bg-white border-4 border-black shadow-[20px_20px_0px_rgba(0,0,0,0.1)] flex flex-col h-[500px]">
         <div className="bg-[#0A0A0A] p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-widest">Support Agent Online</span>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white">
               <span className="material-symbols-outlined">close</span>
            </button>
         </div>

         <div className="flex-1 p-6 bg-zinc-50 overflow-y-auto space-y-4">
            <div className="bg-white border border-zinc-200 p-4 max-w-[80%] rounded-none text-xs font-medium">
               Welcome to Carflex Support. How can we assist you with your bazaar operations today?
            </div>
         </div>

         <div className="p-4 bg-white border-t-2 border-black flex gap-2">
            <input 
              type="text" 
              placeholder="TYPE MESSAGE..."
              className="flex-1 bg-zinc-50 border border-zinc-100 p-3 text-[10px] font-black outline-none focus:border-primary uppercase"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button className="bg-primary text-white p-3 flex items-center justify-center">
               <span className="material-symbols-outlined text-sm">send</span>
            </button>
         </div>
      </div>
    </div>
  );
}
