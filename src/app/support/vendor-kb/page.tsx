export default function VendorKB() {
  const ARTICLES = [
    { title: "Optimizing Your Listing for Sale", desc: "How to take high-impact photos and write competitive descriptions." },
    { title: "Bargaining 101: Negotiation Tactics", desc: "Understanding when to counter and when to accept a bazaar offer." },
    { title: "Commission & Fee Structure", desc: "Transparent breakdown of bazaar entry and transaction fees." },
    { title: "Vehicle Verification Checklist", desc: "What our Agent 2 inspectors look for during ground verification." },
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Vendor <span className="text-primary italic">Intelligence</span></h1>
        <p className="text-xl font-bold text-zinc-500 max-w-2xl">Master the Carflex Bazaar and maximize your asset value.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ARTICLES.map((a) => (
          <div key={a.title} className="p-10 border-4 border-black hover:border-primary transition-all group">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4 group-hover:text-primary">{a.title}</h3>
            <p className="text-zinc-500 font-medium leading-relaxed mb-8">{a.desc}</p>
            <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              Read Article <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
