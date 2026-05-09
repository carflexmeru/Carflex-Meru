"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="border-b border-white/10 sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-black uppercase tracking-widest text-sm">Back</span>
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Privacy Policy</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">1. Introduction</h2>
          <p className="text-zinc-400 leading-relaxed">
            Carflex Bazaar ("we" or "us" or "our") operates the website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service and the choices you have associated with that data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">2. Information Collection and Use</h2>
          <p className="text-zinc-400 leading-relaxed">
            We collect several different types of information for various purposes to provide and improve our service to you.
          </p>
          <div className="space-y-3 ml-4">
            <div>
              <h3 className="font-bold text-white mb-2">Personal Data:</h3>
              <p className="text-zinc-400">
                While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
              </p>
              <ul className="list-disc list-inside mt-2 text-zinc-400 space-y-1">
                <li>Phone number</li>
                <li>Email address</li>
                <li>Vehicle information</li>
                <li>Cookies and usage data</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">3. Use of Data</h2>
          <p className="text-zinc-400 leading-relaxed">
            Carflex Bazaar uses the collected data for various purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To allow you to participate in interactive features of our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our service</li>
            <li>To monitor the usage of our service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">4. Security of Data</h2>
          <p className="text-zinc-400 leading-relaxed">
            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">5. Changes to This Privacy Policy</h2>
          <p className="text-zinc-400 leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the bottom of this Privacy Policy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">6. Contact Us</h2>
          <p className="text-zinc-400 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
            <p className="text-white font-bold">Carflex Bazaar</p>
            <p className="text-zinc-400">Email: support@carflex.com</p>
            <p className="text-zinc-400">Phone: +254 712 345 678</p>
          </div>
        </section>

        <div className="pt-8 border-t border-white/10">
          <p className="text-zinc-500 text-sm">Last updated: May 9, 2026</p>
        </div>
      </div>
    </div>
  );
}
