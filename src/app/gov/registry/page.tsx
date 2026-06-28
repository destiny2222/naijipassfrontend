"use client";

import React, { useState } from "react";
import Link from "next/link";

const mockProcurements = [
  { id: "1", lga: "Oredo", state: "Edo State", entityType: "State Gov", companyName: "Julius Berger", status: "active", sector: "Infrastructure", amount: "₦4.5B" },
  { id: "2", lga: "Ikpoba Okha", state: "Edo State", entityType: "Local Gov", companyName: "Zenith Construction", status: "completed", sector: "Education", amount: "₦850M" },
  { id: "3", lga: "Egor", state: "Edo State", entityType: "State Gov", companyName: "TechCorp Ltd", status: "active", sector: "IT", amount: "₦120M" },
];

export default function RegistryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Procurement Registry</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the central database of awarded contracts and projects. This data powers the public visualizations.
          </p>
        </div>
        <Link href="/gov/registry/add" className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-green-800 hover:-translate-y-0.5 transition-all">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add New Entry
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="relative w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search registry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-green-700/60 focus:bg-white"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Project ID</th>
                <th className="px-6 py-4 font-bold tracking-wider">Company</th>
                <th className="px-6 py-4 font-bold tracking-wider">LGA</th>
                <th className="px-6 py-4 font-bold tracking-wider">Sector</th>
                <th className="px-6 py-4 font-bold tracking-wider">Amount</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {mockProcurements.map((proc, idx) => (
                <tr key={proc.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">EDO-23-{100 + idx}</td>
                  <td className="px-6 py-4 font-bold text-slate-700">{proc.companyName}</td>
                  <td className="px-6 py-4 font-medium">{proc.lga}</td>
                  <td className="px-6 py-4 font-medium">{proc.sector}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{proc.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                      proc.status === 'active' ? 'bg-orange-100 text-[#FF6B2B]' :
                      proc.status === 'completed' ? 'bg-blue-100 text-[#5D87FF]' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {proc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-green-700 hover:text-green-800 font-bold text-xs">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
