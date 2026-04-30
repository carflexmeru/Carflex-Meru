"use client";

import Link from "next/link";

const faqs = [
  {
    question: "HOW DO I SELL MY CAR AT THE BAZAAR?",
    answer: "Simply drive to the Meru Showground on bazaar days. Our agents at the gate will help you register, pay the entry fee via M-Pesa, and assign you a zone. Once inside, our verification team will check your vehicle and help you complete your digital listing."
  },
  {
    question: "WHAT ARE THE ENTRY FEES?",
    answer: "Entry fees vary by zone: Premium Row (KES 500), Standard Row (KES 300), Motorcycles (KES 150), and Commercial Vehicles (KES 700). Fees are paid once per entry."
  },
  {
    question: "IS THE PLATFORM SECURE FOR BUYERS?",
    answer: "Yes. Every car in our 'Live Bazaar' has been physically verified by our ground team. We check ownership documents, engine status, and basic accident history before a car is marked as 'Verified' on the platform."
  },
  {
    question: "HOW DO I MAKE AN OFFER?",
    answer: "When you find a car you like, click the 'Make an Offer' button. You'll be prompted to log in with your phone number via OTP. You can then chat directly with the seller in real-time."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-24 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs mb-12 hover:gap-4 transition-all">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Bazaar
        </Link>

        <h1 className="text-5xl md:text-7xl font-black uppercase mb-4 tracking-tighter">
          FREQUENTLY <br/> <span className="text-primary">ASKED</span> QUESTIONS
        </h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest mb-16">
          Everything you need to know about the Carflex Master Ecosystem.
        </p>

        <div className="space-y-12">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-white/10 pb-12 group">
              <h3 className="text-xl md:text-2xl font-black uppercase mb-4 group-hover:text-primary transition-colors">
                {faq.question}
              </h3>
              <p className="text-gray-400 font-medium leading-relaxed max-w-2xl">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
