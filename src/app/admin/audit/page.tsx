"use client";

import { useEffect, useState } from "react";

export default function AuditExplorer() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    const res = await fetch("/api/admin/audit");
    if (res.ok) {
      const data = await res.json();
      setLogs(data);
    }
    setLoading(false);
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;

  return (
    <div className="bg-white border-4 border-black animate-fade-in overflow-hidden shadow-[20px_20px_0px_rgba(0,0,0,0.05)]">
      <div className="bg-black p-8 text-white flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight">Security Audit Feed</h3>
          <p className="text-primary text-[10px] font-black uppercase tracking-widest mt-1">Immutable Action Ledger</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Streaming</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono">
          <thead>
            <tr className="bg-zinc-50 border-b-2 border-black">
              {["Timestamp", "Admin/Staff", "Action Performed", "Trace ID"].map((h) => (
                <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-zinc-400 uppercase">
                  No system logs detected in this epoch.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                  <td className="px-8 py-6 text-zinc-500">
                    {new Date(log.createdAt).toISOString().replace('T', ' ').split('.')[0]}
                  </td>
                  <td className="px-8 py-6 font-bold text-black uppercase">
                    {log.admin?.fullName || "SYSTEM_ROOT"}
                  </td>
                  <td className="px-8 py-6 text-black font-black uppercase tracking-tight">
                    {log.action}
                  </td>
                  <td className="px-8 py-6 text-zinc-400">
                    {log.id.slice(0, 13)}...
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
