"use client";

import { useEffect, useState } from "react";

export default function FinanceRecon() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [paybill, setPaybill] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchFinance();
  }, []);

  async function fetchFinance() {
    const res = await fetch("/api/admin/finance");
    if (res.ok) {
      const result = await res.json();
      setData(result);
      setPaybill(result.paymentProtocol?.paybill || "");
      setAccountNumber(result.paymentProtocol?.accountNumber || "");
    }
    setLoading(false);
  }

  async function savePaymentProtocol() {
    setFormError("");

    if (!paybill.trim() || !accountNumber.trim()) {
      setFormError("Paybill and plate number are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paybill, accountNumber }),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.error || "Failed to save settings");
      }

      await fetchFinance();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;

  const variance = data.actual - data.expected;

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="nm-card bg-[var(--surface)] border border-[var(--glass-border)] p-8 shadow-[20px_20px_0px_rgba(0,0,0,0.12)] lg:col-span-2 space-y-8">
          <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">Master Ledger Recon</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center py-4 border-b border-[var(--glass-border)]">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Expected Revenue (Bookings)</span>
              <span className="text-xl font-bold text-foreground">KES {data.expected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-[var(--glass-border)]">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Actual Revenue (Transactions)</span>
              <span className="text-xl font-bold text-foreground">KES {data.actual.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-8">
              <span className="text-xs font-black uppercase tracking-widest text-foreground">Net Variance</span>
              <span className={`text-4xl font-black tracking-tighter ${variance >= 0 ? "text-green-600" : "text-primary"}`}>
                {variance >= 0 ? "+" : ""}KES {variance.toLocaleString()}
              </span>
            </div>
          </div>
          {variance !== 0 && (
            <div className="mt-8 bg-primary/10 border-2 border-primary p-6 flex gap-4 items-center">
              <span className="material-symbols-outlined text-primary">warning</span>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Discrepancy detected. Review manual overrides in Audit Logs.</p>
            </div>
          )}
        </div>

        <div className="nm-card bg-[var(--sidebar)] text-foreground p-8 space-y-8 border border-[var(--glass-border)]">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-3">Payment Protocol</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Saved in admin settings and used by payment screens.</p>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Paybill Number</label>
            <input
              value={paybill}
              onChange={(e) => setPaybill(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--glass-border)] px-4 py-4 text-foreground outline-none"
              placeholder="Enter paybill"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500">Plate Number</label>
            <input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--glass-border)] px-4 py-4 text-foreground outline-none"
              placeholder="Enter plate number"
            />
          </div>

          <button
            onClick={savePaymentProtocol}
            disabled={saving || !paybill.trim() || !accountNumber.trim()}
            className="w-full bg-primary px-6 py-4 font-black uppercase tracking-widest text-[10px] text-white shadow-[0_10px_30px_rgba(230,0,0,0.3)] transition-all disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Payment Protocol"}
          </button>

          {formError && (
            <div className="bg-primary/10 border border-primary p-4 text-primary text-[9px] font-black uppercase tracking-widest">
              {formError}
            </div>
          )}

          <div className="border-t border-[var(--glass-border)] pt-6 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Values</h4>
            <div className="space-y-3">
              <div className="bg-[var(--surface)] p-4 border border-[var(--glass-border)]">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Paybill</p>
                <p className="text-xl font-black uppercase">{data.paymentProtocol?.paybill || "Not set"}</p>
              </div>
              <div className="bg-[var(--surface)] p-4 border border-[var(--glass-border)]">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Plate Number</p>
                <p className="text-xl font-black uppercase">{data.paymentProtocol?.accountNumber || "Not set"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="nm-card bg-[var(--surface)] border border-[var(--glass-border)] p-12 shadow-[20px_20px_0px_rgba(0,0,0,0.12)]">
           <h3 className="text-2xl font-black uppercase tracking-tight mb-8 text-foreground">Collection Breakdown</h3>
           <div className="space-y-8">
              {data.breakdown.map((b: any) => (
                <div key={b.method} className="bg-[var(--sidebar)] text-foreground p-8 border border-[var(--glass-border)] flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Collection Method</p>
                      <p className="text-xl font-black uppercase">{b.method}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total Handled</p>
                      <p className="text-2xl font-black tracking-tighter">KES {b.amount.toLocaleString()}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
