export default function LegalTerms() {
  const SECTIONS = [
    { title: "1. Bazaar Entry Rules", content: "All vehicles entering the bazaar must have valid insurance and registration documents." },
    { title: "2. Transaction Liability", content: "Carflex acts as a platform only. Final sales contracts are between the vendor and the buyer." },
    { title: "3. Verification Disclaimer", content: "Agent 2 verification is a visual inspection only and does not replace a professional mechanic's report." },
    { title: "4. Data Privacy", content: "Your phone number and ID are encrypted and used strictly for transaction security." },
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter">Legal <span className="text-primary italic">Framework.</span></h1>
        <p className="text-xl font-bold text-zinc-500 max-w-2xl">The rules of the high-octane automotive ecosystem.</p>
      </div>

      <div className="space-y-12">
        {SECTIONS.map((s) => (
          <section key={s.title} className="max-w-3xl">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{s.title}</h3>
            <p className="text-zinc-500 font-medium leading-relaxed">{s.content}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
