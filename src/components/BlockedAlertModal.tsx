"use client";

interface BlockedAlertProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any;
}

export default function BlockedAlertModal({ isOpen, onClose, vehicle }: BlockedAlertProps) {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-none border-t-[12px] border-primary p-12 animate-scale-up shadow-2xl text-center">
        <div className="w-20 h-20 bg-primary mx-auto flex items-center justify-center text-white mb-8">
           <span className="material-symbols-outlined text-4xl">block</span>
        </div>
        
        <h2 className="text-3xl font-black uppercase tracking-tighter text-black mb-4">I Am Blocked</h2>
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-10">Bazaar Logistic Alert</p>

        <p className="text-xs font-bold text-zinc-500 leading-relaxed uppercase mb-12">
          Your asset {vehicle.regNumber} is currently blocked by another vehicle or structural obstacle. Clicking the button below will alert ground staff to assist you immediately.
        </p>

        <div className="space-y-4">
           <button 
            onClick={() => {
              alert("Support alert sent to Ground Agents!");
              onClose();
            }}
            className="w-full bg-black text-white py-6 font-black uppercase tracking-widest text-sm hover:bg-primary transition-all"
           >
             Alert Ground Staff
           </button>
           <button onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">
             Cancel Request
           </button>
        </div>
      </div>
    </div>
  );
}
