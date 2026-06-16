"use client";

import { useState } from "react";
import Sidebar from "@/src/components/sidebar/page";
import TopNav from "@/src/components/tobnav/page";
import Breadcrumb from "@/src/components/Breadcrumb";

interface Activity {
  id: string;
  ref: string;
  project: string;
  date: string;
  status: "Awarded" | "Under Review" | "Draft" | "Action Required";
}

export default function DashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      ref: "REF-EDO-PPP-2024-001",
      project: "Rehabilitation of Benin-Sapele Road Network",
      date: "Submitted 2 days ago",
      status: "Under Review",
    },
    {
      id: "2",
      ref: "EDO-EDU-2024-012",
      project: "Supply of IT Equipment for Smart Schools",
      date: "Awarded 1 week ago",
      status: "Awarded",
    },
    {
      id: "3",
      ref: "EDO-ENV-2024-009",
      project: "Clean Water Plant Expansion Project",
      date: "Last edited yesterday",
      status: "Draft",
    },
  ]);

  const metrics = [
    { label: "Active Contracts", value: "14", change: "+2 this month", accent: "border-l-4 border-l-[#FF6B2B]" },
    { label: "Verified Tenders", value: "32", change: "Approved Statewide", accent: "border-l-4 border-l-[#101D2D]" },
    { label: "Compliance Score", value: "98%", change: "High Rating", accent: "border-l-4 border-l-emerald-500" },
    { label: "Pending Submissions", value: "3", change: "Due this month", accent: "border-l-4 border-l-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50 text-[#101D2D]">
      {/* Sidebar Layout */}
      <Sidebar activeItem="Dashboard" />

      {/* Main Viewport panel */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        
        {/* TopNav */}
        <TopNav userName="Chidi Nwachukwu" userRole="Certified Contractor" />

        {/* Dashboard Area */}
        <main className="flex-grow p-6 sm:p-8">
          <Breadcrumb />
          
          {/* Header text */}
          <div className="mb-8">
            <h1 className="text-2xl font-black sm:text-3xl">
              Procurement Dashboard
            </h1>
            <p className="mt-1.5 text-xs font-medium text-zinc-400">
              Review operational analytics, active contract metrics, and analyze your pending bids.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className={`rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:shadow-md ${metric.accent}`}
              >
                <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  {metric.label}
                </span>
                <span className="mt-2 block text-2xl font-black text-[#101D2D]">
                  {metric.value}
                </span>
                <span className="mt-1 block text-[10px] font-bold text-[#FF6B2B]">
                  {metric.change}
                </span>
              </div>
            ))}
          </div>

          {/* Details split grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-4">
            
            {/* Left 2 columns: Recent Bid Activities / Analyze Tenders */}
            <div className="lg:col-span-2 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
                <div>
                  <h3 className="text-base font-bold text-[#101D2D]">Analyze Tenders</h3>
                  <p className="text-[11px] text-zinc-400">Track and review contract status and validation indicators.</p>
                </div>
                <a href="#tenders" className="text-xs font-bold text-[#FF6B2B] hover:text-[#E55F23]">View Details &gt;</a>
              </div>

              {/* Timeline list */}
              <div className="space-y-6">
                {activities.map((act) => (
                  <div key={act.id} className="flex gap-4 items-start relative group">
                    <div className="flex flex-col items-center">
                      <span className={`h-4 w-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center shrink-0 ${
                        act.status === "Awarded" ? "bg-emerald-500" :
                        act.status === "Under Review" ? "bg-amber-500" :
                        act.status === "Action Required" ? "bg-red-500" : "bg-zinc-400"
                      }`} />
                      <div className="h-14 w-0.5 bg-zinc-100 group-last:hidden mt-2" />
                    </div>

                    <div className="flex-grow rounded-xl bg-zinc-50/50 p-4 border border-zinc-100 group-hover:border-zinc-200 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{act.ref}</span>
                        <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                          act.status === "Awarded" ? "bg-emerald-50 text-emerald-700" :
                          act.status === "Under Review" ? "bg-amber-50 text-amber-700" :
                          act.status === "Action Required" ? "bg-red-50 text-red-700" :
                          "bg-zinc-100 text-zinc-650"
                        }`}>
                          {act.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#101D2D] mt-2 group-hover:text-[#FF6B2B] transition-colors">{act.project}</h4>
                      <p className="text-[10px] text-zinc-500 mt-1 font-medium">{act.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 1 column: Quick Actions & Alerts */}
            <div className="space-y-8">
              
              {/* Quick Actions Panel */}
              <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-[#101D2D]">Quick Actions</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Accelerate your bid process and document uploads.</p>
                
                <div className="mt-5 space-y-3">
                  <button className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-[#FF6B2B] text-xs font-bold text-white shadow-md shadow-[#FF6B2B]/10 hover:bg-[#E55F23] hover:-translate-y-0.5 transition-all">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Submit New Bid
                  </button>
                  <button className="flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-[#101D2D] text-xs font-bold text-white shadow-md hover:bg-opacity-95 hover:-translate-y-0.5 transition-all">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Verify Documents
                  </button>
                  <button className="flex w-full h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-650 hover:bg-zinc-50 hover:-translate-y-0.5 transition-all">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    AI Compliance Chat
                  </button>
                </div>
              </div>

              {/* Critical Alerts panel */}
              <div className="rounded-2xl border border-red-100 bg-red-50/20 p-5 shadow-sm">
                <div className="flex items-center gap-2.5 text-red-800">
                  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Portal Alerts</h4>
                </div>

                <div className="mt-4 space-y-3.5 text-xs">
                  <div className="border-b border-red-100/30 pb-3 last:border-b-0 last:pb-0">
                    <span className="font-bold text-red-900 block">Lagos State Tender Match</span>
                    <p className="text-[11px] text-red-750 mt-1 leading-normal">
                      A new tender matching your profile & State of Operation has been released in Lagos.
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-red-900 block">TCC Tax Updates</span>
                    <p className="text-[11px] text-red-750 mt-1 leading-normal">
                      Note: Tax Clearance certificate verification rules have been updated. Re-upload may be required.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
