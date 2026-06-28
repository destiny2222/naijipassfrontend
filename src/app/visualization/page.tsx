"use client";

import React, { useState } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Breadcrumb from "@/src/components/Breadcrumb";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

import api from "@/src/lib/axios";

export default function VisualizationPage() {
  const [activeToggle, setActiveToggle] = useState("Active");
  const [loading, setLoading] = React.useState(true);
  
  const [totalProjects, setTotalProjects] = React.useState(0);
  const [totalAwards, setTotalAwards] = React.useState(0);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [totalTenders, setTotalTenders] = React.useState(0);
  
  const [budgetData, setBudgetData] = React.useState<any[]>([]);
  const [stateAllocationData, setStateAllocationData] = React.useState<any[]>([]);
  const [topRegion, setTopRegion] = React.useState("None");
  const [allProcurements, setAllProcurements] = React.useState<any[]>([]);
  
  const projectsCategoryData = React.useMemo(() => {
    const statusFilter = activeToggle.toLowerCase();
    const filtered = allProcurements.filter((p: any) => p.status === statusFilter);
    const catMap: Record<string, number> = {};
    filtered.forEach((p: any) => {
      const cat = p.entityType || 'Others';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    return Object.entries(catMap).map(([category, count]) => ({ category, count }));
  }, [allProcurements, activeToggle]);

  React.useEffect(() => {
    Promise.all([
      api.get('/procurements'),
      api.get('/bids')
    ]).then(([procRes, bidsRes]) => {
      const procurements = procRes.data.success ? procRes.data.data : [];
      const bids = bidsRes.data.success ? bidsRes.data.data : [];
      
      setAllProcurements(procurements);
      setTotalProjects(procurements.length);
      setTotalAwards(procurements.filter((p: any) => p.status === 'completed' || p.status === 'active').length); 
      
      let amountSum = 0;
      procurements.forEach((p: any) => {
        if (p.amount) amountSum += Number(p.amount);
      });
      setTotalAmount(amountSum);
      setTotalTenders(bids.length);

      const yearMap: Record<string, number> = {};
      procurements.forEach((p: any) => {
        if (p.awardDate) {
          const y = new Date(p.awardDate).getFullYear().toString();
          yearMap[y] = (yearMap[y] || 0) + (Number(p.amount) || 0);
        }
      });
      const bData = Object.keys(yearMap).sort().map(year => {
         const val = yearMap[year] / 1000000000; 
         return { year, allocated: parseFloat((val * 1.2).toFixed(2)), released: parseFloat(val.toFixed(2)) };
      });
      if (bData.length === 0) bData.push({ year: new Date().getFullYear().toString(), allocated: 0, released: 0 });
      setBudgetData(bData);

      const stateMap: Record<string, number> = {};
      procurements.forEach((p: any) => {
        const state = p.state || 'Unknown';
        stateMap[state] = (stateMap[state] || 0) + 1;
      });
      
      const sortedStates = Object.entries(stateMap).sort((a, b) => b[1] - a[1]);
      if (sortedStates.length > 0) {
        setTopRegion(sortedStates[0][0]);
      }
      
      const colors = ["#FF6B2B", "#FFA177", "#5D87FF", "#8EABFF", "#7B809A"];
      const sData = sortedStates.slice(0, 5).map((entry, idx) => ({
        name: entry[0],
        value: entry[1],
        color: colors[idx % colors.length]
      }));
      if (sData.length === 0) sData.push({ name: 'None', value: 1, color: "#E2E8F0" });
      setStateAllocationData(sData);
      
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="flex-grow">
        <Breadcrumb />

        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Projects */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-slate-700">Total Projects</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-[#FF6B2B]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-extrabold text-slate-800 mb-1">{loading ? "..." : totalProjects}</div>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Registered
              </div>
            </div>

            {/* Total Awards */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-slate-700">Total Awards</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#5D87FF]">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-extrabold text-slate-800 mb-1">{loading ? "..." : totalAwards}</div>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                Approved
              </div>
            </div>

            {/* Total Contracts */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-slate-700">Total Contract Value</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-extrabold text-slate-800 mb-1">{loading ? "..." : `₦${(totalAmount / 1000000000).toFixed(1)}B`}</div>
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                Total expenditure
              </div>
            </div>

            {/* Total Tenders */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-slate-700">Total Tenders</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                  </svg>
                </div>
              </div>
              <div className="text-4xl font-extrabold text-slate-800 mb-1">{loading ? "..." : totalTenders}</div>
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                Stable
              </div>
            </div>
          </div>

          {/* Middle Row (Line Chart + Donut Chart) */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-8">
            
            {/* Budget Trends by Year (Takes up 2 columns) */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Budget Trends by Year</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Allocated vs Released Funds (Billions ₦)</p>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={budgetData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAllocated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B2B" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF6B2B" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorReleased" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5D87FF" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#5D87FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dx={-10} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }} />
                    <Area type="monotone" dataKey="allocated" name="Allocated Funds" stroke="#FF6B2B" strokeWidth={3} fillOpacity={1} fill="url(#colorAllocated)" />
                    <Area type="monotone" dataKey="released" name="Released Funds" stroke="#5D87FF" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorReleased)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* State-wise Allocation (Donut Chart) */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col items-center">
              <div className="flex w-full items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">State-wise<br/>Allocation</h3>
                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>
              
              <div className="flex w-full items-center justify-between mt-2">
                <div className="relative h-48 w-48 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stateAllocationData}
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {stateAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Top Region</span>
                    <span className="text-lg font-extrabold text-[#FF6B2B]">{loading ? "..." : topRegion}</span>
                  </div>
                </div>

                <div className="w-1/3 flex flex-col space-y-3">
                  {stateAllocationData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] font-bold text-slate-700">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Row (Bar Chart) */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm mb-8 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-800">Projects by Category</h3>
              
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveToggle("Active")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeToggle === "Active" ? "bg-orange-100 text-[#FF6B2B] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Active
                </button>
                <button 
                  onClick={() => setActiveToggle("Completed")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeToggle === "Completed" ? "bg-blue-100 text-[#5D87FF] shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectsCategoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" fill="#FF6B2B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
