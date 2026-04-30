"use client";

interface SecurityAlertProps {
  isOpen: boolean;
  onClose: () => void;
  regNumber: string;
}

export default function SecurityAlertModal({ isOpen, onClose, regNumber }: SecurityAlertProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-red-600/90 backdrop-blur-xl"></div>
      
      <div className="relative bg-white w-full max-w-lg rounded-none border-[12px] border-black p-12 animate-bounce shadow-2xl text-center">
        <div className="w-24 h-24 bg-primary mx-auto flex items-center justify-center text-white mb-8 shadow-[0_0_50px_#E60000]">
           <span className="material-symbols-outlined text-5xl">warning</span>
        </div>
        
        <h2 className="text-5xl font-black uppercase tracking-tighter text-black mb-4">POLICE ALERT</h2>
        <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-10">Asset DNA Blacklisted</p>

        <div className="bg-zinc-50 p-8 border-4 border-black mb-10">
           <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-2">Flagged Reg Number</p>
           <p className="text-4xl font-black tracking-tighter">{regNumber}</p>
        </div>

        <p className="text-xs font-bold text-zinc-500 leading-relaxed uppercase mb-12">
          This asset matches the National Stolen Vehicle Registry. Gate barrier has been locked. Do not approach the driver. Call bazaar security immediately.
        </p>

        <div className="space-y-4">
           <button className="w-full bg-black text-white py-6 font-black uppercase tracking-widest text-sm hover:bg-primary transition-all">
             Acknowledge & Notify Security
           </button>
           <button onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">
             Manual Override (Admin Only)
           </button>
        </div>
      </div>
    </div>
  );
}
