"use client";

interface ShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: {
    regNumber: string;
    make: string;
    model: string;
    price: number;
    year: number;
  };
}

export default function ShareCardModal({ isOpen, onClose, vehicle }: ShareCardProps) {
  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} on Carflex Bazaar! Price: KES ${vehicle.price.toLocaleString()}. ${shareUrl}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-sm rounded-none border-[12px] border-black overflow-hidden animate-scale-up shadow-2xl">
        {/* Card Content for "Screenshotting" aesthetic */}
        <div className="bg-[#0A0A0A] p-8 text-white space-y-6">
          <div className="flex justify-between items-start">
             <div className="w-8 h-8 bg-primary flex items-center justify-center font-black italic text-xs">CF</div>
             <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Official Bazaar Listing</p>
          </div>

          <div className="aspect-[16/10] bg-zinc-900 border border-white/5 flex items-center justify-center">
             <span className="material-symbols-outlined text-6xl text-white/5">directions_car</span>
          </div>

          <div className="space-y-1">
            <p className="text-primary text-[10px] font-black uppercase tracking-widest">KES {vehicle.price.toLocaleString()}</p>
            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">
              {vehicle.year} <br/> {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">{vehicle.regNumber}</p>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
             <div className="flex gap-1">
                {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 bg-primary"></div>)}
             </div>
             <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Scan to Verify</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-6 bg-white space-y-4">
           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 text-center">Share this asset DNA</p>
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')}
                className="bg-[#25D366] text-white py-4 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:opacity-90"
              >
                <span className="material-symbols-outlined text-sm">share</span> WhatsApp
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  alert("Link copied to clipboard!");
                }}
                className="bg-black text-white py-4 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-primary transition-all"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span> Copy Link
              </button>
           </div>
           <button onClick={onClose} className="w-full py-2 text-[8px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">Dismiss</button>
        </div>
      </div>
    </div>
  );
}
