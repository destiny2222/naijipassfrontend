"use client";

import React from "react";
import Link from "next/link";

export default function GovDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">State Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of your state's procurement and feedback metrics.
          </p>
        </div>
        <Link href="/gov/bids/create" className="inline-flex items-center gap-2 rounded-lg bg-mod-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-mod-primary focus:ring-offset-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Procurement Bid
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[18px] border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Bids</h3>
          <p className="mt-2 text-4xl font-bold text-slate-800">14</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-mod-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            +2 this week
          </div>
        </div>

        <div className="rounded-[18px] border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Applications</h3>
          <p className="mt-2 text-4xl font-bold text-slate-800">128</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            -5% this month
          </div>
        </div>

        <div className="rounded-[18px] border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Registry Entries</h3>
          <p className="mt-2 text-4xl font-bold text-slate-800">892</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-mod-primary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            +15 new contracts
          </div>
        </div>
      </div>

      <div className="rounded-[18px] border border-slate-100 bg-white shadow-sm overflow-hidden mt-8">
        <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Recent Applications</h2>
          <Link href="/gov/bids" className="text-sm font-semibold text-mod-primary hover:text-blue-700">View All</Link>
        </div>
        <div className="p-6 text-center text-sm text-slate-500">
          Application data will populate here when users apply to your bids.
        </div>
      </div>
    </div>
  );
}
