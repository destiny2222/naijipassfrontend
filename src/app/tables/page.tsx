"use client";

import { useState, useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Breadcrumb from "@/src/components/Breadcrumb";
import api from "@/src/lib/axios";

export default function TablesPage() {
  const [procurements, setProcurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/procurements').then(res => {
      if (res.data.success) {
        setProcurements(res.data.data);
      }
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case "active":
        return <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold tracking-wide text-[#E56345] uppercase">Active</span>;
      case "completed":
        return <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold tracking-wide text-[#5D87FF] uppercase">Completed</span>;
      case "suspended":
        return <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-[11px] font-bold tracking-wide text-red-600 uppercase">Suspended</span>;
      case "cancelled":
        return <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-500 uppercase">Cancelled</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold tracking-wide text-slate-600 uppercase">{status || 'Unknown'}</span>;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-800">
      <Navbar />

      <main className="flex-grow">
        <Breadcrumb />
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Procurement Data
              </h1>
              <p className="mt-1.5 text-sm font-medium text-slate-500">
                Comprehensive dataset of awarded contracts across Edo State LGAs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select className="appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 pr-10 text-xs font-bold text-slate-600 outline-none hover:bg-slate-50 focus:border-[#5D87FF]/60 focus:ring-1 focus:ring-[#5D87FF]/60 transition-all">
                  <option>Sector Type</option>
                  <option>Construction</option>
                  <option>Healthcare</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <select className="appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 pr-10 text-xs font-bold text-slate-600 outline-none hover:bg-slate-50 focus:border-[#5D87FF]/60 focus:ring-1 focus:ring-[#5D87FF]/60 transition-all">
                  <option>All LGAs</option>
                  <option>Oredo</option>
                  <option>Egor</option>
                  <option>Uhunmwonde</option>
                  <option>Owan West</option>
                  <option>Ikpoba-Okha</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                More Filters
              </button>

              <button className="inline-flex items-center gap-2 rounded-lg bg-[#EBF3FE] text-[#5D87FF] px-4 py-2 text-xs font-bold hover:bg-[#5D87FF] hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAFBFD] border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-4">Project ID</th>
                  <th scope="col" className="px-6 py-4">LGA</th>
                  <th scope="col" className="px-6 py-4">Entity Type</th>
                  <th scope="col" className="px-6 py-4">Contractor</th>
                  <th scope="col" className="px-6 py-4">Award Date</th>
                  <th scope="col" className="px-6 py-4 text-right">Amount (₦)</th>
                  <th scope="col" className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">Loading data...</td>
                  </tr>
                ) : procurements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">No procurement data found.</td>
                  </tr>
                ) : (
                  procurements.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-5 font-bold text-[#E56345]">
                        <div className="w-[80px] break-words whitespace-normal">{item.id.substring(0, 8).toUpperCase()}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 font-bold text-slate-800">
                        {item.lga || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {item.entityType || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-bold text-slate-800 block max-w-[200px] whitespace-normal">
                          {item.contractor || 'N/A'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 font-bold text-slate-600">
                        {item.awardDate ? new Date(item.awardDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-right font-black text-slate-800">
                        {item.amount ? `₦${Number(item.amount).toLocaleString()}` : 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-center">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
