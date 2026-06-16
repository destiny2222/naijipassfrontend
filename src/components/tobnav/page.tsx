"use client";

import { useState } from "react";

interface TopNavProps {
  userName?: string;
  userRole?: string;
}

export default function TopNav({
  userName = "Chidi Nwachukwu",
  userRole = "Certified Contractor",
}: TopNavProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const mockNotifications = [
    { id: 1, title: "New Bid Opportunity", desc: "Benin-Sapele road expansion project matches your profile.", time: "2m ago" },
    { id: 2, title: "Document Verified", desc: "Your tax clearance certificate has been validated.", time: "1h ago" },
    { id: 3, title: "Tender Update", desc: "Deadline for Smart Schools IT Equipment extended.", time: "5h ago" },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-zinc-100 bg-white/90 px-6 backdrop-blur-md">
      {/* Search Bar */}
      <div className="flex w-96 max-w-xs sm:max-w-md items-center">
        <label htmlFor="top-search" className="sr-only">
          Search portal
        </label>
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="top-search"
            type="text"
            placeholder="Search tenders, businesses, or files..."
            className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-4 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-6">
        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-xl border border-zinc-150 p-2.5 text-zinc-500 hover:bg-zinc-50 hover:text-[#101D2D] transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B2B] opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF6B2B]"></span>
            </span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 origin-top-right rounded-2xl border border-zinc-100 bg-white p-4 shadow-xl shadow-zinc-150/40 ring-1 ring-black/5 focus:outline-none">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-2">
                <span className="text-sm font-bold text-[#101D2D]">Alerts & Notices</span>
                <button className="text-xs font-semibold text-[#FF6B2B] hover:text-[#E55F23]">Mark all read</button>
              </div>
              <div className="space-y-3">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="group relative rounded-xl p-2 hover:bg-zinc-50 transition-colors">
                    <h4 className="text-xs font-bold text-zinc-800 leading-snug group-hover:text-[#FF6B2B] transition-colors">{notif.title}</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{notif.desc}</p>
                    <span className="text-[9px] font-semibold text-zinc-400 mt-1 block">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="flex items-center gap-3 border-l border-zinc-150 pl-6">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-bold text-[#101D2D]">{userName}</span>
            <span className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase">{userRole}</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#101D2D] text-white text-sm font-black shadow-md border-2 border-white">
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
        </div>
      </div>
    </header>
  );
}
