"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from "@/src/lib/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    bids: 0,
    kycs: 0,
  });
  const [recentKycs, setRecentKycs] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<{name: string, users: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, bidsRes, kycsRes] = await Promise.all([
          api.get('/profile/all'),
          api.get('/bids'),
          api.get('/kyc/all')
        ]);

        const usersCount = usersRes.data.success ? usersRes.data.users.length : 0;
        const allUsers = usersRes.data.success ? usersRes.data.users : [];
        const bidsCount = bidsRes.data.success ? bidsRes.data.data.length : 0;
        
        let pendingKycCount = 0;
        let fetchedKycs = [];
        if (kycsRes.data.success) {
          fetchedKycs = kycsRes.data.data;
          pendingKycCount = fetchedKycs.filter((k: any) => k.status === 'inprogress' || k.status === 'pending').length;
        }

        setStats({
          users: usersCount,
          bids: bidsCount,
          kycs: pendingKycCount,
        });

        setRecentKycs(fetchedKycs.slice(0, 5));

        // Compute dynamic user growth for the last 6 months
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          months.push({
            year: d.getFullYear(),
            month: d.getMonth(), // 0-11
            name: d.toLocaleString('en-US', { month: 'short' }),
            count: 0
          });
        }

        let baseUsersCount = 0; // users before the 6 month window

        allUsers.forEach((u: any) => {
          const dateStr = u.emailVerifiedAt || new Date().toISOString(); // fallback to now if no date
          const uDate = new Date(dateStr);
          const uYear = uDate.getFullYear();
          const uMonth = uDate.getMonth();
          
          let placed = false;
          for (let m of months) {
            if (m.year === uYear && m.month === uMonth) {
              m.count++;
              placed = true;
              break;
            }
          }
          // If the user registered before our 6 month window, add to base count
          if (!placed && uDate.getTime() < new Date(months[0].year, months[0].month, 1).getTime()) {
            baseUsersCount++;
          }
        });

        let cumulative = baseUsersCount;
        const growthData = months.map(m => {
          cumulative += m.count;
          return { name: m.name, users: cumulative };
        });

        setUserGrowthData(growthData);

      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);



  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Super Admin Dashboard</h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            System-wide overview of users, bids, and compliance metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[18px] border border-slate-100 bg-white p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-mod-primary/10 transition-transform group-hover:scale-150"></div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider relative z-10">Total Users</h3>
          <p className="mt-2 text-4xl font-bold text-slate-800 relative z-10">{loading ? "..." : stats.users}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-mod-primary relative z-10">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Registered across platform
          </div>
        </div>

        <div className="rounded-[18px] border border-slate-100 bg-white p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#13DEB9]/10 transition-transform group-hover:scale-150"></div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider relative z-10">Active Bids</h3>
          <p className="mt-2 text-4xl font-bold text-slate-800 relative z-10">{loading ? "..." : stats.bids}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-500 relative z-10">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Across all states
          </div>
        </div>

        <div className="rounded-[18px] border border-slate-100 bg-white p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#FFAE1F]/10 transition-transform group-hover:scale-150"></div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider relative z-10">Pending KYCs</h3>
          <p className="mt-2 text-4xl font-bold text-slate-800 relative z-10">{loading ? "..." : stats.kycs}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-amber-500 relative z-10">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Requires action
          </div>
        </div>

        <div className="rounded-[18px] border border-slate-100 bg-white p-6 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#FA896B]/10 transition-transform group-hover:scale-150"></div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider relative z-10">System Alerts</h3>
          <p className="mt-2 text-4xl font-bold text-slate-800 relative z-10">3</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-red-500 relative z-10">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Server notifications
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mt-8">
        <div className="rounded-[18px] border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Platform User Growth</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="users" fill="#5D87FF" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-[18px] border border-slate-100 bg-white shadow-sm overflow-hidden mt-8">
        <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between bg-white">
          <h2 className="text-lg font-semibold text-slate-800">Recent KYC Applications</h2>
          <Link href="/admin/kyc" className="text-sm font-semibold text-mod-primary hover:text-blue-700 bg-mod-primary/10 px-4 py-2 rounded-lg transition-colors">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 border-b border-slate-100">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Business Name</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Reg Date</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Industry</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Loading...</td>
                </tr>
              ) : recentKycs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No recent KYC applications found.</td>
                </tr>
              ) : (
                recentKycs.map((kyc: any) => (
                  <tr key={kyc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {kyc.type === 'business' ? kyc.businessName : `${kyc.firstName} ${kyc.lastName}`}
                    </td>
                    <td className="px-6 py-4 text-slate-500 capitalize">{kyc.type}</td>
                    <td className="px-6 py-4 text-slate-500">{kyc.industryCategory?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                        kyc.status === 'approved' ? 'bg-[#13DEB9]/10 text-[#13DEB9]' : 
                        kyc.status === 'rejected' ? 'bg-[#FA896B]/10 text-[#FA896B]' : 
                        'bg-[#FFAE1F]/10 text-[#FFAE1F]'
                      }`}>
                        {kyc.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href="/admin/kyc" className="text-mod-primary font-semibold hover:text-blue-700">Review</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
