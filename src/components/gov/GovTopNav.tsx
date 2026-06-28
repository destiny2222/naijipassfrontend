"use client";

import { useState } from "react";

interface GovTopNavProps {
  userName?: string;
  userRole?: string;
  onMenuClick?: () => void;
}

export default function GovTopNav({
  userName = "Admin User",
  userRole = "State Admin",
  onMenuClick,
}: GovTopNavProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("Edo State");

  const states = ["Edo State", "Lagos State", "Kano State", "Rivers State"];

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-zinc-100 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:text-mod-primary hover:bg-blue-50 rounded-lg focus:outline-none transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* State Selector */}
        <div className="hidden sm:flex items-center">
          <div className="relative">
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm font-bold text-slate-800 outline-none transition-all hover:bg-slate-100 focus:border-mod-primary focus:bg-white focus:ring-1 focus:ring-mod-primary cursor-pointer"
            >
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-full p-2.5 text-slate-500 hover:bg-blue-50 hover:text-mod-primary transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mod-secondary opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mod-primary"></span>
            </span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-[-60px] sm:right-0 mt-3 w-72 sm:w-80 origin-top-right rounded-2xl border border-zinc-100 bg-white p-4 shadow-xl shadow-zinc-150/40 ring-1 ring-black/5 focus:outline-none">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-sm font-bold text-slate-800">Gov Alerts</span>
                <button className="text-xs font-semibold text-mod-primary hover:text-blue-700">Clear</button>
              </div>
              <div className="space-y-3">
                <div className="group relative rounded-xl p-2 hover:bg-slate-50 transition-colors">
                  <h4 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-mod-primary transition-colors">New Bid Application</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Julius Berger submitted proposal for EDO-2023-089.</p>
                  <span className="text-[9px] font-semibold text-slate-400 mt-1 block">10m ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-100 pl-3 sm:pl-6">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-bold text-slate-800">{userName}</span>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">{userRole}</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mod-primary/10 text-mod-primary text-sm font-bold shadow-sm">
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
        </div>
      </div>
    </header>
  );
}
