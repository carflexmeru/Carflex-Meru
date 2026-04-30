"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="max-w-4xl space-y-12 animate-fade-in">
      {/* Profile Section */}
      <section className="bg-white border-4 border-black p-12 shadow-[15px_15px_0px_#0A0A0A]">
        <h3 className="text-2xl font-black uppercase tracking-tight mb-8">Personal Intelligence</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
            <input
              type="text"
              defaultValue="Brian K."
              className="bg-zinc-50 border-2 border-zinc-100 p-4 font-bold outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">ID Number</label>
            <input
              type="text"
              defaultValue="12345678"
              className="bg-zinc-50 border-2 border-zinc-100 p-4 font-bold outline-none focus:border-black"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Phone (Verified)</label>
            <div className="flex gap-4">
              <input
                disabled
                type="tel"
                defaultValue="+254 700 000 000"
                className="flex-1 bg-zinc-100 border-2 border-zinc-100 p-4 font-bold text-zinc-400"
              />
              <button className="bg-black text-white px-6 font-black uppercase text-[10px] tracking-widest">Update</button>
            </div>
          </div>
        </div>
        <button className="mt-12 bg-primary text-white px-10 py-4 font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
          Save Profile Changes
        </button>
      </section>

      {/* Security & System */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white border-4 border-black p-10">
          <h4 className="text-lg font-black uppercase tracking-tight mb-6">Security Hub</h4>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-xs uppercase tracking-tight">Two-Factor Auth</p>
                <p className="text-zinc-400 text-[10px] font-medium">Protect via SMS codes</p>
              </div>
              <button 
                onClick={() => setTwoFactor(!twoFactor)}
                className={`w-14 h-8 flex items-center p-1 transition-all ${twoFactor ? 'bg-primary' : 'bg-zinc-200'}`}
              >
                <div className={`w-6 h-6 bg-white transition-all ${twoFactor ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-xs uppercase tracking-tight">Active Sessions</p>
                <p className="text-zinc-400 text-[10px] font-medium">1 currently logged in device</p>
              </div>
              <button className="text-primary font-black uppercase text-[9px] tracking-widest underline decoration-2 underline-offset-4">Reset</button>
            </div>
          </div>
        </section>

        <section className="bg-white border-4 border-black p-10">
          <h4 className="text-lg font-black uppercase tracking-tight mb-6">Communication</h4>
          <div className="space-y-6">
             <div className="flex items-center justify-between">
              <div>
                <p className="font-black text-xs uppercase tracking-tight">SMS Notifications</p>
                <p className="text-zinc-400 text-[10px] font-medium">Bargain and Offer alerts</p>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 flex items-center p-1 transition-all ${notifications ? 'bg-primary' : 'bg-zinc-200'}`}
              >
                <div className={`w-6 h-6 bg-white transition-all ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className="bg-red-50 border-4 border-primary p-12">
        <h4 className="text-lg font-black uppercase tracking-tight text-primary mb-4">Danger Zone</h4>
        <p className="text-primary/70 text-[10px] font-black uppercase tracking-widest mb-8">Permanently delete your master identity and all active listings.</p>
        <button className="bg-primary text-white px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-black transition-colors">
          Delete Identity
        </button>
      </section>
    </div>
  );
}
