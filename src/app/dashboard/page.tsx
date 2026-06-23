"use client";

import { useEffect, useState } from "react";
// import Breadcrumb from "@/src/components/Breadcrumb";
import { useAuth } from "@/src/hooks/useAuth";
import { getMyKycStatus, getVerifiedBusinessesDirectory } from "@/src/services/kyc/kyc";


interface Activity {
  id: string;
  ref: string;
  project: string;
  date: string;
  status: string;
}

import { getBids } from "@/src/services/bids/bids";
import { getDashboardAnalytics } from "@/src/services/analytics/analytics";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function DashboardPage() {
  const [activities, setActivities] = useState < Activity[] > ([]);
  const { user, loading, hasSubmittedKyc } = useAuth();
  const isBusiness = user?.kyc?.details?.type === 'business' || (user as any)?.kyc?.type === 'business';
  const [fetchingBids, setFetchingBids] = useState(false);
  const [analyticsData, setAnalyticsData] = useState < any > (null);
  const [verifiedBusinesses, setVerifiedBusinesses] = useState < any[] > ([]);
  const [metrics, setMetrics] = useState([
    { label: "Active Contracts", value: "...", change: "...", accent: "border-l-4 border-l-[#FF6B2B]" },
    { label: "Verified Businesses", value: "...", change: "...", accent: "border-l-4 border-l-[#101D2D]" },
    { label: "Closed Bids", value: "...", change: "...", accent: "border-l-4 border-l-emerald-500" },
    { label: "My Total Bids", value: "...", change: "...", accent: "border-l-4 border-l-amber-500" },
  ]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getDashboardAnalytics();
        if (res.success && res.data) {
          if (Array.isArray(res.data)) {
            const defaultAccents = [
              "border-l-4 border-l-[#FF6B2B]",
              "border-l-4 border-l-[#101D2D]",
              "border-l-4 border-l-emerald-500",
              "border-l-4 border-l-amber-500"
            ];

            const updatedMetrics = res.data.map((item: any, index: number) => ({
              label: item.label || "Metric",
              value: item.value || "0",
              change: item.change || "",
              accent: item.accent || defaultAccents[index % defaultAccents.length]
            }));

            if (updatedMetrics.length > 0) {
              setMetrics(updatedMetrics);
            }
          } else if (typeof res.data === 'object') {
            setMetrics(prev => {
              const newMetrics = [...prev];
              newMetrics[0] = { ...newMetrics[0], label: "Active Contracts", value: res.data.bidsSummary?.active?.toString() || "0", change: `Total: ${res.data.bidsSummary?.total || 0}`, accent: "border-l-4 border-l-[#FF6B2B]" };
              newMetrics[1] = { ...newMetrics[1], label: "Verified Businesses", value: res.data.kycSummary?.approved?.toString() || "0", change: "Approved Statewide", accent: "border-l-4 border-l-[#101D2D]" };
              newMetrics[2] = { ...newMetrics[2], label: "Closed Bids", value: res.data.bidsSummary?.closed?.toString() || "0", change: "Completed Tenders", accent: "border-l-4 border-l-emerald-500" };
              return newMetrics;
            });
            setAnalyticsData(res.data);
          }
        }
      } catch (error) {
        // console.error("Failed to fetch analytics", error);
      }
    };

    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (user) {
      getMyKycStatus();

      const fetchVerifiedBusinesses = async () => {
        try {
          const res = await getVerifiedBusinessesDirectory();
          if (res.success && res.data) {
            setVerifiedBusinesses(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch verified businesses", error);
        }
      };

      fetchVerifiedBusinesses();
    }
  }, [user]);

  useEffect(() => {
    const fetchBids = async () => {
      setFetchingBids(true);
      try {
        const response = await getBids({}); // Fetch all bids
        if (response.success && response.data) {
          const userBids = user ? response.data.filter((b: any) => b.createdById === user.id) : [];
          const totalBids = userBids.length;
          setMetrics(prev => {
            const newMetrics = [...prev];
            newMetrics[3] = { ...newMetrics[3], label: "My Total Bids", value: totalBids.toString(), change: "Created by you", accent: "border-l-4 border-l-amber-500" };
            return newMetrics;
          });

          // Filter for activities table using user's bids
          const activeBids = userBids.filter((b: any) => b.status === "active" || b.status === "published");
          const fetchedActivities: Activity[] = activeBids.map((bid: any) => {
            return {
              id: bid.id,
              ref: bid.bidNumber,
              project: bid.title,
              date: `Deadline: ${new Date(bid.deadline).toLocaleDateString()}`,
              status: bid.status || "Unknown",
            };
          });
          setActivities(fetchedActivities);
        }
      } catch (error) {
        console.error("Failed to fetch bids", error);
      } finally {
        setFetchingBids(false);
      }
    };

    fetchBids();
  }, []);

  // metrics are now handled in state

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto w-full">

            {/* Header text */}
            <div className="mb-8">
              <h1 className="text-2xl font-black sm:text-3xl text-[#101D2D]">
                {isBusiness ? "Procurement Dashboard" : `Welcome back, ${user?.name?.split(' ')[0] || "User"}`}
              </h1>
              <p className="mt-1.5 text-xs font-medium text-zinc-500">
                {isBusiness
                  ? "Review operational analytics, active contract metrics, and analyze your pending bids."
                  : "Here is an overview of your active bids and system updates for today."}
              </p>
            </div>

            {/* KYC Status Alert */}
            {user?.kyc && user.kyc.status !== 'approved' && (
              <div className={`mb-8 rounded-2xl border p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${user.kyc.status === 'rejected' ? 'border-red-100 bg-red-50/50' : 'border-amber-100 bg-amber-50/50'
                }`}>
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${user.kyc.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                    {user.kyc.status === 'rejected' ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold uppercase tracking-wider ${user.kyc.status === 'rejected' ? 'text-red-900' : 'text-amber-900'
                      }`}>
                      KYC Status: {user.kyc.status}
                    </h4>
                    <p className={`text-xs mt-1 font-medium ${user.kyc.status === 'rejected' ? 'text-red-800' : 'text-amber-800'
                      }`}>
                      {user.kyc.status === 'rejected'
                        ? 'Your KYC application was rejected. Please review and resubmit your details.'
                        : 'Your KYC details have been submitted and are currently being verified by our compliance team. Some features may be restricted until approved.'}
                    </p>
                  </div>
                </div>
                {user.kyc.status === 'rejected' && (
                  <button
                    onClick={() => window.location.href = '/onboarding'}
                    className="shrink-0 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700 transition-colors"
                  >
                    Resubmit KYC
                  </button>
                )}
              </div>
            )}

            {/* Metrics Grid */}
            {isBusiness ? (
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
            ) : (
              <div className="space-y-8 mb-8">
                {/* Individual Top Cards */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:shadow-md relative">
                    <div className="absolute top-6 right-6 text-[#FF6B2B] bg-orange-50 p-2 rounded-xl">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h3 className="text-sm font-bold text-[#101D2D]">Active Bids</h3>
                    <p className="mt-4 text-4xl font-black text-[#101D2D]">{activities.length}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-zinc-500">
                      <svg className="h-3.5 w-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      <span className="text-emerald-600">Up to date</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:shadow-md relative">
                    <div className="absolute top-6 right-6 text-[#FF6B2B] bg-orange-50 p-2 rounded-xl">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <h3 className="text-sm font-bold text-[#101D2D]">Registered Businesses</h3>
                    <p className="mt-4 text-4xl font-black text-[#101D2D]">{verifiedBusinesses.length}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-zinc-500">
                      <svg className="h-3.5 w-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      Verified network
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-br from-[#101D2D] to-zinc-800 p-6 shadow-lg relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute -right-4 -top-4 opacity-10">
                      <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="bg-[#FF6B2B] p-1.5 rounded-lg text-white shadow-md shadow-[#FF6B2B]/20">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-base font-black text-white">NaijaBot AI</h3>
                      </div>
                      <p className="text-xs font-medium text-zinc-300 leading-relaxed">
                        Need help navigating procurement laws or finding specific bid requirements?
                      </p>
                    </div>
                    <button className="relative z-10 mt-5 w-full rounded-xl bg-[#FF6B2B] py-2.5 text-xs font-bold text-white shadow-lg shadow-[#FF6B2B]/20 hover:bg-[#E55F23] transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                      Chat Now
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h2 className="text-lg font-black text-[#101D2D] mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#FF6B2B]/30 cursor-pointer group">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 mb-4 group-hover:text-[#FF6B2B] group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <h3 className="text-sm font-bold text-[#101D2D] mb-1">Report Issue</h3>
                      <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">Flag discrepancies or report technical issues securely.</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#FF6B2B]/30 cursor-pointer group">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 mb-4 group-hover:text-[#FF6B2B] group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </div>
                      <h3 className="text-sm font-bold text-[#101D2D] mb-1">Submit Bid</h3>
                      <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">Start a new tender submission process with guided steps.</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#FF6B2B]/30 cursor-pointer group">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-500 mb-4 group-hover:text-[#FF6B2B] group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                      </div>
                      <h3 className="text-sm font-bold text-[#101D2D] mb-1">Search Laws</h3>
                      <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">Access the comprehensive database of procurement regulations.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Charts Grid */}
            {isBusiness && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Bids by Category */}
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-[#101D2D]">Bids by Category</h3>
                    <p className="text-[11px] text-zinc-400">Total number of bids published per category.</p>
                  </div>
                  <div className="h-[250px] w-full">
                    {analyticsData?.bidsByCategory?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.bidsByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                          <XAxis dataKey="categoryName" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                          <Tooltip cursor={{ fill: '#f4f4f5' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} labelStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#101D2D', marginBottom: '4px' }} />
                          <Bar dataKey="count" fill="#FF6B2B" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-zinc-400 font-medium bg-zinc-50/50 rounded-xl border border-zinc-100 border-dashed">No category data available.</div>
                    )}
                  </div>
                </div>

                {/* KYCs by Industry */}
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-[#101D2D]">Businesses by Industry</h3>
                    <p className="text-[11px] text-zinc-400">Distribution of registered businesses by sector.</p>
                  </div>
                  <div className="h-[250px] w-full">
                    {analyticsData?.kycsByIndustry?.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.kycsByIndustry} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                          <XAxis dataKey="categoryName" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                          <Tooltip cursor={{ fill: '#f4f4f5' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} labelStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#101D2D', marginBottom: '4px' }} />
                          <Bar dataKey="count" fill="#101D2D" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-zinc-400 font-medium bg-zinc-50/50 rounded-xl border border-zinc-100 border-dashed">No industry data available.</div>
                    )}
                  </div>
                </div>

                {/* Bids Status Overview */}
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-[#101D2D]">Contracts Overview</h3>
                    <p className="text-[11px] text-zinc-400">Ratio of active to closed contracts.</p>
                  </div>
                  <div className="h-[250px] w-full">
                    {analyticsData?.bidsSummary ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Active', value: analyticsData.bidsSummary.active, color: '#FF6B2B' },
                              { name: 'Closed', value: analyticsData.bidsSummary.closed, color: '#a1a1aa' }
                            ].filter(d => d.value > 0)}
                            cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                          >
                            {[
                              { name: 'Active', value: analyticsData.bidsSummary.active, color: '#FF6B2B' },
                              { name: 'Closed', value: analyticsData.bidsSummary.closed, color: '#a1a1aa' }
                            ].filter(d => d.value > 0).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: '500' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-zinc-400 font-medium bg-zinc-50/50 rounded-xl border border-zinc-100 border-dashed">No contract data available.</div>
                    )}
                  </div>
                </div>

                {/* KYC Status Overview */}
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-base font-bold text-[#101D2D]">Verification Status</h3>
                    <p className="text-[11px] text-zinc-400">Current state of business verifications.</p>
                  </div>
                  <div className="h-[250px] w-full">
                    {analyticsData?.kycSummary ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Approved', value: analyticsData.kycSummary.approved, color: '#10b981' },
                              { name: 'In Progress', value: analyticsData.kycSummary.inprogress, color: '#3b82f6' },
                              { name: 'Pending', value: analyticsData.kycSummary.pending, color: '#f59e0b' },
                              { name: 'Rejected', value: analyticsData.kycSummary.rejected, color: '#ef4444' }
                            ].filter(d => d.value > 0)}
                            cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                          >
                            {[
                              { name: 'Approved', value: analyticsData.kycSummary.approved, color: '#10b981' },
                              { name: 'In Progress', value: analyticsData.kycSummary.inprogress, color: '#3b82f6' },
                              { name: 'Pending', value: analyticsData.kycSummary.pending, color: '#f59e0b' },
                              { name: 'Rejected', value: analyticsData.kycSummary.rejected, color: '#ef4444' }
                            ].filter(d => d.value > 0).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: '500' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-zinc-400 font-medium bg-zinc-50/50 rounded-xl border border-zinc-100 border-dashed">No verification data available.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Verified Businesses Slider */}
            <div className="mb-8">
              <div className="mb-4">
                <h2 className="text-lg font-black text-[#101D2D]">Verified Businesses Directory</h2>
                <p className="text-xs text-zinc-500 mt-1">Explore approved and vetted businesses on the platform.</p>
              </div>

              {verifiedBusinesses.length > 0 ? (
                <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x px-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {verifiedBusinesses.map((biz) => (
                    <div key={biz.id} className="min-w-[280px] max-w-[280px] sm:min-w-[320px] sm:max-w-[320px] snap-start shrink-0 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" title="Approved & Verified"></div>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 text-[#101D2D] font-black text-lg">
                          {biz.businessName?.charAt(0) || "B"}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#101D2D] line-clamp-1">{biz.businessName}</h4>
                          <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 mt-1 text-[10px] font-bold text-zinc-600">
                            {biz.industry}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4 text-xs">
                        <div className="flex items-start gap-2 text-zinc-500">
                          <svg className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="line-clamp-1">{biz.businessType || "N/A"}</span>
                        </div>
                        <div className="flex items-start gap-2 text-zinc-500">
                          <svg className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="line-clamp-2">{biz.businessAddress || "Location not provided"}</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-zinc-50 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-zinc-400">
                          Joined {new Date(biz.createdAt).toLocaleDateString()}
                        </span>
                        <button className="text-xs font-bold text-[#FF6B2B] group-hover:text-[#E55F23] flex items-center gap-1 transition-colors">
                          View Profile
                          <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-100 bg-white p-8 text-center shadow-sm">
                  <p className="text-sm font-medium text-zinc-500">No verified businesses available to show right now.</p>
                </div>
              )}
            </div>

            {/* Details split grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-4">



              {/* Right 1 column: Quick Actions & Alerts */}
              <div className="space-y-8">

                {/* Quick Actions Panel */}
                {/* <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
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
              </div> */}

              </div>
            </div>
    </div>
  );
}
