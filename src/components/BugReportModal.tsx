"use client";

import { useState } from "react";

export default function BugReportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [desc, setDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert("REPORT SUBMITTED TO ENGINEERING");
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-md rounded-none border-t-[12px] border-primary p-10 animate-scale-up shadow-2xl">
        <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">Report <span className="text-primary italic">Anomaly</span></h3>
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-8">Technical Dispatch System</p>

        <div className="space-y-6">
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Issue Description</label>
              <textarea
                required
                rows={4}
                placeholder="WHAT HAPPENED?"
                className="w-full bg-zinc-50 border-2 border-zinc-100 p-4 font-bold outline-none focus:border-primary uppercase"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
           </div>
           
           <div className="pt-4 flex gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-4 border-2 border-black font-black uppercase text-[10px] tracking-widest hover:bg-zinc-50 transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={isSubmitting}
                className="flex-2 bg-black text-white px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Syncing..." : "Submit Report"}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
