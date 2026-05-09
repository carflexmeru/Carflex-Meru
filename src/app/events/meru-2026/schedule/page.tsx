"use client";

export default function MeruEventSchedule() {
  const schedule = [
    {
      day: "MAY 03, 2026 (SUNDAY)",
      title: "HIGH-STAKES BAZAAR",
      events: [
        { time: "7:00 AM", action: "Rapid Asset Deployment & Check-in", zone: "ADMIN GATE" },
        { time: "8:30 AM", action: "Final Zone Positioning & Forensics", zone: "ALL ZONES" },
        { time: "9:00 AM", action: "Mission Opening: Public Entrance", zone: "MAIN GATE" },
        { time: "11:00 AM", action: "VIP Premier Row & Official Ribbon Cut", zone: "ZONE A" },
        { time: "1:00 PM", action: "Live Asset Reviews & Auctions", zone: "THE YARD" },
        { time: "4:00 PM", action: "Final Sales Clearance Node", zone: "ADMIN GATE" },
        { time: "5:30 PM", action: "Asset Extraction & Mission End", zone: "GLOBAL" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-16">
      <div className="flex flex-col gap-2 text-center items-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Tactical Timeline</p>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">PROGRAM <br/> <span className="text-stroke italic">OF OPS.</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">One-day high-intensity schedule for the Meru Car Bazaar mission.</p>
      </div>

      <div className="space-y-12">
         {schedule.map((day, i) => (
           <div key={i} className="nm-card p-12 space-y-8">
              <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-white/5 pb-6">
                 <div>
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">{day.day}</p>
                    <h3 className="text-4xl font-black uppercase tracking-tighter italic">{day.title}</h3>
                 </div>
                 <span className="nm-inset px-4 py-2 text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em]">INTENSIVE_MISSION_PROFILE</span>
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
