"use client";

import { useEffect, useState } from "react";
import TransactionDetailsModal from "@/components/TransactionDetailsModal";

interface Transaction {
  id: string;
  createdAt: string;
  amount: number;
  method: string;
  reference: string;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const phone = localStorage.getItem("carflex_phone");
    if (phone) {
      fetchTransactions(phone);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchTransactions(phone: string) {
    try {
      const res = await fetch(`/api/dashboard/transactions?phone=${phone}`);
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div></div>;

  return (
    <div className="bg-white border-4 border-black animate-fade-in overflow-hidden shadow-[20px_20px_0px_rgba(0,0,0,0.05)]">
      <div className="bg-[#0A0A0A] p-8 text-white flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight">Ledger Summary</h3>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Real-Time Database Records</p>
        </div>
        <button className="bg-primary px-6 py-2 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">download</span>
          Statement
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b-2 border-black">
              {["Date", "Reference", "Description", "Method", "Amount", "Status"].map((h) => (
                <th key={h} className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-zinc-400 font-bold uppercase tracking-widest text-xs">
                  No transactions found in your ledger.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => setSelectedTransaction(tx)}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors cursor-pointer group"
                >
                  <td className="px-8 py-6 font-bold text-sm">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  <td className="px-8 py-6 font-mono text-xs text-zinc-400 group-hover:text-primary transition-colors">{tx.reference}</td>
                  <td className="px-8 py-6 font-bold text-sm uppercase">Carflex Service Payment</td>
                  <td className="px-8 py-6">
                    <span className="bg-black text-white px-3 py-1 rounded-none font-black text-[9px] uppercase tracking-widest">
                      {tx.method}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-lg tracking-tighter text-black">
                    KES {tx.amount.toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">PAID</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-8 bg-zinc-50 border-t-2 border-black flex justify-between items-center">
         <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Expenditure</p>
            <p className="text-3xl font-black tracking-tighter">
              KES {transactions.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
            </p>
         </div>
         <p className="text-zinc-400 font-bold text-[10px] uppercase max-w-xs text-right">
           Transactions are pulled directly from the Carflex Master Ledger.
         </p>
      </div>

      <TransactionDetailsModal 
        isOpen={!!selectedTransaction} 
        onClose={() => setSelectedTransaction(null)} 
        transaction={selectedTransaction} 
      />
    </div>
  );
}
