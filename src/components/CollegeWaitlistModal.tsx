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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="bg-primary/10 border-b border-white/5 p-8 relative">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-1">Join the Waitlist</h2>
          <p className="text-primary text-xs font-black uppercase tracking-widest">Carflex Training Institute Hub</p>
          <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {status === "success" ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
              <span className="material-symbols-outlined text-green-500 text-4xl">check_circle</span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase mb-2">You're on the list!</h3>
            <p className="text-gray-400 font-medium">We'll notify you as soon as admissions open.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-primary/50"
                placeholder="JOHN DOE"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-primary/50"
                  placeholder="JOHN@EXAMPLE.COM"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-primary/50"
                  placeholder="+254..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Course Preference</label>
              <select
                value={formData.coursePref}
                onChange={(e) => setFormData({ ...formData, coursePref: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-primary/50 appearance-none"
              >
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Automotive Sales">Automotive Sales</option>
                <option value="Dealer Management">Dealer Management</option>
                <option value="Industrial Tech">Industrial Tech</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(239,68,68,0.3)] disabled:opacity-50"
            >
              {status === "loading" ? "SUBMITTING..." : "JOIN WAITLIST"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
