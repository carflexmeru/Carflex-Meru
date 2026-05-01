"use client";

import StaffLayout from "@/components/layout/StaffLayout";
import { useState, useEffect } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/staff/logs");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-12">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-4">
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">MAINFRAME <br/> <span className="text-primary italic text-stroke">LOGS.</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Reviewing chronological operational data and system audit trails.</p>
          </div>
          <button 
            onClick={fetchLogs}
            className="nm-card p-4 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>

        <div className="nm-card p-10">
          <div className="space-y-8">
            {loading ? (
              <div className="nm-inset p-20 text-center animate-pulse">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Retrieving System History...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="nm-inset p-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">No logs found in the current buffer.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="nm-inset p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-8">
                      <div className="w-12 h-12 nm-card flex items-center justify-center bg-zinc-900">
                        <span className="material-symbols-outlined text-primary text-xl">
                          {log.type === 'ASSET_REGISTRATION' ? 'directions_car' : 'account_balance_wallet'}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                            log.type === 'ASSET_REGISTRATION' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                          }`}>
                            {log.type}
                          </span>
                          <span className="text-[9px] text-zinc-500 font-bold">
                            {new Date(log.timestamp).toLocaleTimeString()} • {new Date(log.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm font-black text-foreground uppercase tracking-tight">{log.description}</p>
                        <p className="text-[8px] text-zinc-600 font-black uppercase mt-1">Authorized by: {log.user}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                       <span className={`text-[9px] font-black uppercase tracking-widest ${
                         log.status === 'active' || log.status === 'COMPLETED' ? 'text-green-500' : 'text-primary'
                       }`}>
                         {log.status}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
