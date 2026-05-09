"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <div className="border-b border-white/10 sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-black uppercase tracking-widest text-sm">Back</span>
          </Link>
          <h1 className="text-2xl font-black uppercase tracking-tighter">Terms of Service</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">1. Acceptance of Terms</h2>
          <p className="text-zinc-400 leading-relaxed">
            By accessing and using Carflex Bazaar, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">2. Use License</h2>
          <p className="text-zinc-400 leading-relaxed">
            Permission is granted to temporarily download one copy of the materials (information or software) on Carflex Bazaar for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on the site</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">3. Disclaimer</h2>
          <p className="text-zinc-400 leading-relaxed">
            The materials on Carflex Bazaar are provided on an 'as is' basis. Carflex makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">4. Limitations</h2>
          <p className="text-zinc-400 leading-relaxed">
            In no event shall Carflex or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Carflex Bazaar, even if Carflex or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">5. Accuracy of Materials</h2>
          <p className="text-zinc-400 leading-relaxed">
            The materials appearing on Carflex Bazaar could include technical, typographical, or photographic errors. Carflex does not warrant that any of the materials on its website are accurate, complete, or current. Carflex may make changes to the materials contained on its website at any time without notice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">6. Links</h2>
          <p className="text-zinc-400 leading-relaxed">
            Carflex has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Carflex of the site. Use of any such linked website is at the user's own risk.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">7. Modifications</h2>
          <p className="text-zinc-400 leading-relaxed">
            Carflex may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-primary">8. Governing Law</h2>
          <p className="text-zinc-400 leading-relaxed">
            These terms and conditions are governed by and construed in accordance with the laws of Kenya, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <div className="pt-8 border-t border-white/10">
          <p className="text-zinc-500 text-sm">Last updated: May 9, 2026</p>
        </div>
      </div>
    </div>
  );
}
