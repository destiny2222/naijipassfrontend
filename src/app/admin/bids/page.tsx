"use client";

import React, { useEffect, useState } from "react";
import api from "@/src/lib/axios";

interface Bid {
  id: string;
  bidNumber: string;
  title: string;
  agency: string;
  formattedDeadline: string;
  status: string;
  bidStatus: string;
  category: { id: number; name: string } | null;
}

export default function AdminBidsPage() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await api.get('/bids');
        if (response.data.success) {
          setBids(response.data.data);
        } else {
          setError(response.data.message || "Failed to load bids");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "An error occurred while fetching bids");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">All Bids</h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            System-wide overview of all procurement applications and tender contracts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-all">
            Export Data
          </button>
        </div>
      </div>

      <div className="rounded-[18px] border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5 bg-white">
          <h2 className="text-lg font-semibold text-slate-800">System Bids ({bids.length})</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-mod-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500 font-medium">
            {error}
          </div>
        ) : bids.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            No bids found in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Bid Number</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Agency</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Deadline</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {bids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{bid.bidNumber}</td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{bid.title}</td>
                    <td className="px-6 py-4 text-slate-500">{bid.agency}</td>
                    <td className="px-6 py-4 text-slate-500">{bid.category?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-500">{bid.formattedDeadline}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                        bid.status === 'active' ? 'bg-[#13DEB9]/10 text-[#13DEB9]' : 
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {bid.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
