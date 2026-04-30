"use client";

import { useState } from "react";

export default function CollegeWaitlistModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coursePref: "Mechanical Engineering",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/college/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setTimeout(() => {
          onClose();
          setStatus("idle");
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="relative nm-card w-full max-w-xl overflow-hidden border-none">
        {/* Header */}
        <div className="p-10 relative">
          <div className="nm-inset inline-flex items-center gap-2 px-3 py-1 mb-4">
             <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_#E60000]"></span>
             <p className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Carflex College Hub</p>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">Request <br/> <span className="text-stroke italic">Enrollment.</span></h2>
          <button onClick={onClose} className="absolute top-10 right-10 text-zinc-600 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {status === "success" ? (
          <div className="p-16 text-center animate-scale-up">
            <div className="w-20 h-20 nm-inset rounded-full flex items-center justify-center mx-auto mb-8 border-none">
              <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">NODE REGISTERED</h3>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] leading-relaxed">Your application has been logged into the <br/> Carflex Admissions Mainframe.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-10 pt-0 space-y-8">
            <div className="space-y-3">
              <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest px-2">Operator Full Name</label>
              <div className="nm-inset">
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-transparent px-6 py-4 text-white text-sm font-bold focus:outline-none placeholder:text-white/5 border-none"
                  placeholder="IDENTITY_STRING"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest px-2">Email Node</label>
                <div className="nm-inset">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent px-6 py-4 text-white text-sm font-bold focus:outline-none placeholder:text-white/5 border-none"
                    placeholder="NAME@HUB.COM"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest px-2">Phone Link</label>
                <div className="nm-inset">
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent px-6 py-4 text-white text-sm font-bold focus:outline-none placeholder:text-white/5 border-none"
                    placeholder="+254_SYNC"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest px-2">Discipline Selection</label>
              <div className="nm-inset">
                <select
                  value={formData.coursePref}
                  onChange={(e) => setFormData({ ...formData, coursePref: e.target.value })}
                  className="w-full bg-transparent px-6 py-4 text-white text-sm font-bold focus:outline-none appearance-none border-none"
                >
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Automotive Sales">Automotive Sales</option>
                  <option value="Dealer Management">Dealer Management</option>
                  <option value="Industrial Tech">Industrial Tech</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full nm-card bg-primary text-white py-6 font-black text-xs tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-95 transition-all border-none shadow-[0_15px_30px_rgba(230,0,0,0.3)] disabled:opacity-50"
            >
              {status === "loading" ? "UPLOADING DATA..." : "AUTHORIZE ENROLLMENT"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
