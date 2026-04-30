"use client";

interface ZonalMismatchProps {
  isOpen: boolean;
  onClose: () => void;
  regNumber: string;
  expectedZone: string;
  actualZone: string;
}

export default function ZonalMismatchModal({ isOpen, onClose, regNumber, expectedZone, actualZone }: ZonalMismatchProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md"></div>
      
      <div className="relative bg-white w-full max-w-md rounded-none border-[12px] border-primary p-12 animate-scale-up shadow-2xl text-center">
        <div className="w-20 h-20 bg-primary mx-auto flex items-center justify-center text-white mb-8">
           <span className="material-symbols-outlined text-4xl">wrong_location</span>
        </div>
        
        <h2 className="text-3xl font-black uppercase tracking-tighter text-black mb-4">Zonal Mismatch</h2>
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-10">Bazaar Positioning Error</p>

        <div className="grid grid-cols-2 gap-4 mb-10">
           <div className="bg-zinc-50 p-6 border-2 border-zinc-100">
              <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">Booked Zone</p>
              <p className="font-black text-black">{expectedZone}</p>
           </div>
           <div className="bg-primary/5 p-6 border-2 border-primary/20">
              <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-1">Detected At</p>
              <p className="font-black text-primary">{actualZone}</p>
           </div>
        </div>

        <p className="text-xs font-bold text-zinc-500 leading-relaxed uppercase mb-12">
          Vehicle {regNumber} is parked in an unauthorized zone. Ground staff must relocate the asset to {expectedZone} immediately to avoid penalty fees.
        </p>

        <div className="space-y-4">
           <button onClick={onClose} className="w-full bg-black text-white py-6 font-black uppercase tracking-widest text-sm hover:bg-primary transition-all">
             Acknowledge & Relocate
           </button>
           <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">
             Request Zone Upgrade
           </button>
        </div>
      </div>
    </div>
  );
}
