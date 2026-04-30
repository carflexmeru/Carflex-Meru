export default function BuyerSafety() {
  const TIPS = [
    { icon: "verified_user", title: "Look for Verified Assets", desc: "Always prioritize listings with the 'Verified' badge. These have been physically inspected by Agent 2." },
    { icon: "payments", title: "Secure Payments", desc: "Never pay outside the Carflex system. Our M-Pesa integration ensures a digital paper trail." },
    { icon: "gavel", title: "Legal Documentation", desc: "Ensure all transfer documents are signed at the official Carflex transfer desk." },
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Safe <span className="text-primary italic">Trading.</span></h1>
        <p className="text-xl font-bold text-zinc-500 max-w-2xl">Your security is the core of the Carflex DNA.</p>
      </div>

      <div className="space-y-8">
        {TIPS.map((t) => (
          <div key={t.title} className="flex gap-8 p-10 bg-zinc-50 border-2 border-zinc-100">
            <div className="w-16 h-16 bg-black text-white flex items-center justify-center shrink-0">
               <span className="material-symbols-outlined text-3xl">{t.icon}</span>
            </div>
            <div>
               <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{t.title}</h3>
               <p className="text-zinc-500 font-medium leading-relaxed">{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
