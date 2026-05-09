"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SupportRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the support vendor KB page
    router.push("/support/vendor-kb");
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin">
          <span className="material-symbols-outlined text-4xl text-primary">settings</span>
        </div>
        <p className="text-zinc-400 font-bold uppercase tracking-widest">Redirecting to Support...</p>
      </div>
    </div>
  );
}
