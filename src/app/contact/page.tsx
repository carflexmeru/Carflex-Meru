"use client";

import { useEffect, useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const syncTheme = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    syncTheme();
    window.addEventListener("themechange", syncTheme);
    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

  const mutedText = isDark ? "#a1a1a1" : "#5b5048";
  const inputBackground = isDark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.68)";
  const inputColor = isDark ? "#f5f5f5" : "#1f1a17";
  const inputBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";

  return (
    <div className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-24" style={{ color: "var(--foreground)" }}>
      <div className="space-y-12">
        <div className="flex flex-col gap-2">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.8em]">Communication Node</p>
          <h1 className="text-7xl font-black uppercase tracking-tighter leading-none italic">
            GET IN <br /> <span className="text-stroke">TOUCH.</span>
          </h1>
          <p className="font-bold uppercase tracking-widest text-[10px] mt-6 leading-loose" style={{ color: mutedText }}>
            Initialize contact for high-stakes inquiries, partnerships, or technical support. Our command center is operational 24/7.
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-6 group">
            <div className="nm-inset w-16 h-16 flex items-center justify-center text-primary group-hover:scale-110 transition-all" style={{ backgroundColor: isDark ? undefined : "rgba(255,255,255,0.70)" }}>
              <span className="material-symbols-outlined">call</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: mutedText }}>
                Voice Terminal
              </p>
              <p className="text-xl font-black" style={{ color: "var(--foreground)" }}>
                +254 700 000 000
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 group">
            <div className="nm-inset w-16 h-16 flex items-center justify-center text-primary group-hover:scale-110 transition-all" style={{ backgroundColor: isDark ? undefined : "rgba(255,255,255,0.70)" }}>
              <span className="material-symbols-outlined">alternate_email</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: mutedText }}>
                Email Uplink
              </p>
              <p className="text-xl font-black" style={{ color: "var(--foreground)" }}>
                ops@carflex.co.ke
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 group">
            <div className="nm-inset w-16 h-16 flex items-center justify-center text-primary group-hover:scale-110 transition-all" style={{ backgroundColor: isDark ? undefined : "rgba(255,255,255,0.70)" }}>
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: mutedText }}>
                Headquarters
              </p>
              <p className="text-xl font-black italic" style={{ color: "var(--foreground)" }}>
                MERU, KENYA
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="nm-card p-12 relative overflow-hidden" style={{ backgroundColor: isDark ? undefined : "rgba(255,255,255,0.62)" }}>
        {submitted ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-primary flex items-center justify-center rounded-full shadow-[0_0_50px_rgba(230,0,0,0.5)]">
              <span className="material-symbols-outlined text-white text-5xl">check</span>
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter italic" style={{ color: "var(--foreground)" }}>
              MISSION RECEIVED.
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed" style={{ color: mutedText }}>
              Your inquiry has been successfully forensics-logged. Our command center will respond within 2 operational hours.
            </p>
          </div>
        ) : (
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: mutedText }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="IDENTIFY YOURSELF"
                className="contact-field w-full nm-inset bg-transparent p-6 font-bold outline-none border-none focus:ring-2 ring-primary/30"
                style={{
                  backgroundColor: inputBackground,
                  color: inputColor,
                  border: `1px solid ${inputBorder}`,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: mutedText }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="DIGITAL UPLINK"
                  className="contact-field w-full nm-inset bg-transparent p-6 font-bold outline-none border-none focus:ring-2 ring-primary/30"
                  style={{
                    backgroundColor: inputBackground,
                    color: inputColor,
                    border: `1px solid ${inputBorder}`,
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: mutedText }}>
                  Inquiry Type
                </label>
                <select
                  className="contact-field w-full nm-inset bg-transparent p-6 font-bold outline-none border-none focus:ring-2 ring-primary/30 uppercase text-xs"
                  style={{
                    backgroundColor: inputBackground,
                    color: inputColor,
                    border: `1px solid ${inputBorder}`,
                  }}
                >
                  <option>Vendor Partnership</option>
                  <option>Asset Inquiry</option>
                  <option>Technical Support</option>
                  <option>Event Management</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: mutedText }}>
                Message Content
              </label>
              <textarea
                rows={4}
                required
                placeholder="DESCRIBE THE MISSION..."
                className="contact-field w-full nm-inset bg-transparent p-6 font-bold outline-none border-none focus:ring-2 ring-primary/30 resize-none"
                style={{
                  backgroundColor: inputBackground,
                  color: inputColor,
                  border: `1px solid ${inputBorder}`,
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full nm-card bg-primary py-6 font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] transition-all border-none"
              style={{
                boxShadow: "0 20px 50px rgba(230,0,0,0.22)",
                color: isDark ? "white" : "#1f1a17",
              }}
            >
              TRANSMIT INQUIRY
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
