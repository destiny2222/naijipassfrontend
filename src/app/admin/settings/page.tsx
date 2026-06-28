"use client";

import React from "react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">System Settings</h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Configure global portal properties, APIs, and authentication parameters.
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-lg bg-mod-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-all">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-[18px] border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">General Configuration</h2>
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-sm font-bold text-slate-700 mb-2">Platform Name</label>
              <input 
                type="text" 
                defaultValue="GovPortal Operations"
                className="rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm focus:border-mod-primary focus:bg-white focus:ring-4 focus:ring-mod-primary/10 transition-all"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold text-slate-700 mb-2">Support Email</label>
              <input 
                type="email" 
                defaultValue="support@naijapass.com"
                className="rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm focus:border-mod-primary focus:bg-white focus:ring-4 focus:ring-mod-primary/10 transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="rounded-[18px] border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800">Two-Factor Auth</h4>
                <p className="text-[11px] text-slate-500">Require 2FA for all admins</p>
              </div>
              <div className="h-6 w-11 rounded-full bg-mod-primary relative cursor-pointer">
                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition-transform"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
