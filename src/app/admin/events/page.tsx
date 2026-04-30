"use client";

import { useEffect, useState } from "react";

export default function EventManager() {
  const [events, setEvents] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [eRes, zRes] = await Promise.all([
      fetch("/api/events"),
      fetch("/api/zones")
    ]);
    if (eRes.ok) setEvents(await eRes.json());
    if (zRes.ok) setZones(await zRes.json());
    setLoading(false);
  }

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Active Bazaar Events */}
        <div className="bg-white border-4 border-black p-12">
           <div className="flex justify-between items-center mb-12">
              <h3 className="text-2xl font-black uppercase tracking-tight">Bazaar Lifecycle</h3>
              <button className="bg-primary text-white px-6 py-2 font-black uppercase text-[10px] tracking-widest hover:bg-black">
                 New Event
              </button>
           </div>
           
           <div className="space-y-4">
              {events.map(e => (
                <div key={e.id} className="flex justify-between items-center p-6 bg-zinc-50 border border-zinc-100">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Scheduled Date</p>
                      <p className="font-black uppercase">{new Date(e.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                   </div>
                   <div className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest ${e.isActive ? 'bg-green-100 text-green-600' : 'bg-zinc-200 text-zinc-500'}`}>
                      {e.isActive ? 'LIVE' : 'ARCHIVED'}
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Zonal Capacity Management */}
        <div className="bg-[#0A0A0A] text-white p-12 border-4 border-black">
           <h3 className="text-2xl font-black uppercase tracking-tight mb-12">Zonal Capacity Control</h3>
           <div className="space-y-6">
              {zones.map(z => (
                <div key={z.id} className="bg-white/5 p-8 border border-white/10 space-y-6 relative overflow-hidden">
                   {z.occupancy >= z.capacity && (
                     <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-[8px] font-black uppercase tracking-widest">
                        AT CAPACITY
                     </div>
                   )}
                   <div className="flex justify-between items-end">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Zone Name</p>
                         <h4 className="text-xl font-black uppercase tracking-tight">{z.name}</h4>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Entry Fee</p>
                         <p className="text-lg font-black text-primary">KES {z.price.toLocaleString()}</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-400">
                         <span>Occupancy Level</span>
                         <span>{z.occupancy} / {z.capacity}</span>
                      </div>
                      <div className="h-2 bg-white/5 w-full">
                         <div className={`h-full transition-all duration-1000 ${z.occupancy >= z.capacity ? 'bg-primary shadow-[0_0_15px_#E60000]' : 'bg-white'}`} style={{ width: `${(z.occupancy/z.capacity)*100}%` }}></div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
