"use client";

export default function MeruEventSchedule() {
  const schedule = [
    {
      day: "DAY 01 - AUG 14",
      title: "ASSET DEPLOYMENT",
      events: [
        { time: "08:00", action: "Exhibitor Identity Clearance", zone: "ADMIN GATE" },
        { time: "10:00", action: "Asset Positioning & Zone Setup", zone: "ALL ZONES" },
        { time: "16:00", action: "Security Forensic Sweeps", zone: "SHOWGROUND" }
      ]
    },
    {
      day: "DAY 02 - AUG 15",
      title: "OFFICIAL OPENING",
      events: [
        { time: "09:00", action: "VIP Premiere & VIP Preview", zone: "ZONE A" },
        { time: "11:00", action: "Bazaar Command Ribbon Cutting", zone: "MAIN STAGE" },
        { time: "14:00", action: "Exhibitor Networking Node", zone: "VIP LOUNGE" }
      ]
    },
    {
      day: "DAY 03 - AUG 16",
      title: "PUBLIC BAZAAR",
      events: [
        { time: "09:00", action: "General Public Access", zone: "MAIN GATE" },
        { time: "12:00", action: "Live Asset Reviews & Spec Talks", zone: "THE YARD" },
        { time: "15:00", action: "Bazaar Spotlight: Top 10 Picks", zone: "MAIN STAGE" }
      ]
    },
    {
      day: "DAY 04 - AUG 17",
      title: "EXTRACTION OPS",
      events: [
        { time: "14:00", action: "Final Sales Clearance", zone: "ADMIN GATE" },
        { time: "16:00", action: "Asset Extraction & Exit Ops", zone: "MAIN GATE" },
        { time: "18:00", action: "Showground Decommissioning", zone: "GLOBAL" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-16">
      <div className="flex flex-col gap-2 text-center items-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Tactical Timeline</p>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">PROGRAM <br/> <span className="text-stroke italic">OF OPS.</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">Operational schedule for the Meru Car Bazaar mission.</p>
      </div>

      <div className="space-y-12">
         {schedule.map((day, i) => (
           <div key={i} className="nm-card p-12 space-y-8">
              <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-white/5 pb-6">
                 <div>
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">{day.day}</p>
                    <h3 className="text-4xl font-black uppercase tracking-tighter italic">{day.title}</h3>
                 </div>
                 <span className="nm-inset px-4 py-2 text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em]">Operational Phase {i + 1}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {day.events.map((event, j) => (
                   <div key={j} className="nm-inset p-8 space-y-4 group hover:bg-white/5 transition-all">
                      <div className="flex justify-between items-start">
                         <span className="text-2xl font-black text-foreground italic">{event.time}</span>
                         <span className="text-primary material-symbols-outlined text-sm">schedule</span>
                      </div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight leading-tight">{event.action}</h4>
                      <div className="flex items-center gap-2 pt-2">
                         <span className="w-1 h-1 rounded-full bg-primary"></span>
                         <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{event.zone}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
