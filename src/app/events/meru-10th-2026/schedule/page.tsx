"use client";

export default function Meru10thSchedule() {
  const schedule = [
    { time: "10:00 AM", title: "Gates Open", desc: "Access control and vehicle staging begin." },
    { time: "12:00 PM", title: "Vendor Check-in", desc: "Registered vendors report to their zones." },
    { time: "2:00 PM", title: "Live Showcase", desc: "Public marketplace activity begins." },
    { time: "4:00 PM", title: "Verification Sweep", desc: "Security and gate checks go live." },
    { time: "6:00 PM", title: "Close Down", desc: "Wrap-up and exit management." },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 space-y-16">
      <div className="flex flex-col gap-2 text-center items-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Program Sequence</p>
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none text-foreground">EVENT <br/> <span className="text-stroke italic">SCHEDULE.</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mt-4">Operational flow for the 10th edition deployment.</p>
      </div>

      <div className="space-y-4">
        {schedule.map((item) => (
          <div key={item.time} className="nm-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">{item.time}</p>
              <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">{item.title}</h3>
            </div>
            <p className="max-w-xl text-[10px] font-bold uppercase tracking-widest text-zinc-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
