"use client";

import { useState, useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Breadcrumb from "@/src/components/Breadcrumb";
import { getBids } from "@/src/services/bids/bids";
import Link from "next/link";

interface Tender {
  id: string;
  slug?: string;
  ref: string;
  title: string;
  desc: string;
  budget: string;
  sector: string;
  location: string;
  deadline: string;
  status: string;
  type: string;
  procuringEntity: string;
}

export default function ProjectsPage() {
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await getBids({});
        if (response.success && response.data) {
          const formattedBids = response.data.map((bid: any) => ({
            id: bid.id,
            slug: bid.slug,
            ref: bid.bidNumber || "N/A",
            title: bid.title,
            desc: bid.description,
            budget: "Not Specified",
            sector: bid.category?.name || "General",
            location: bid.location || "Statewide",
            deadline: new Date(bid.deadline).toLocaleDateString(),
            status: bid.status || "Active",
            type: "Government",
            procuringEntity: bid.agency || "State Government",
          }));
          setTenders(formattedBids);
        }
      } catch (error) {
        console.error("Failed to fetch bids", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTenders();
  }, []);

  const uniqueLocations = Array.from(new Set(tenders.map(t => t.location))).filter(Boolean).sort();

  const filteredTenders = tenders.filter((t) => {
    const matchesSector = selectedSector === "All" || t.sector === selectedSector;
    const matchesSource = selectedSource === "All" || t.type === selectedSource;
    const matchesLocation = selectedLocation === "All" || t.location === selectedLocation;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.procuringEntity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSource && matchesLocation && matchesSearch;
  });

  const handleStartCompliance = () => {
    setAnalyzing(true);
    setAiAnalysisResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setAiAnalysisResult(
        "Analysis Complete: Your profile matches 94% of standard tender pre-requisites! Ensure you have an active Tax Clearance (TCC) valid through 2024 before submission."
      );
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50">
      <Navbar />

      <main className="flex-grow">
        <Breadcrumb />
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B2B]">
            Procurement & Open Contracting
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#101D2D] sm:text-4xl">
            Open Tenders & Opportunities
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-500">
            Explore, filter, and bid on active infrastructure and service projects across the state.
            Ensuring transparency, accessibility, and competitive procurement for all contractors.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          {/* Left: Filter Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Filters:</span>
            
            {/* Sector select dropdown */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50/50 py-2 px-3.5 text-xs font-bold text-zinc-700 outline-none focus:border-[#FF6B2B]/60 focus:bg-white"
            >
              <option value="All">All Sectors</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Education & Tech">Education & Tech</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
            </select>

            {/* Location dropdown */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50/50 py-2 px-3.5 text-xs font-bold text-zinc-700 outline-none focus:border-[#FF6B2B]/60 focus:bg-white"
            >
              <option value="All">All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {/* Bid Source dropdown */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50/50 py-2 px-3.5 text-xs font-bold text-zinc-700 outline-none focus:border-[#FF6B2B]/60 focus:bg-white"
            >
              <option value="All">Bid Source: All</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
            </select>
          </div>

          {/* Right: Search */}
          <div className="relative w-full lg:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tenders..."
              className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-4 text-xs text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-[#FF6B2B]/60 focus:bg-white focus:ring-1 focus:ring-[#FF6B2B]/60"
            />
          </div>
        </div>

        {/* Content Split Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Left 2 Cols: Tender List */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center">
                <p className="text-sm text-zinc-500">Loading open tenders...</p>
              </div>
            ) : filteredTenders.length > 0 ? (
              filteredTenders.map((tender) => (
                <div 
                  key={tender.id}
                  className="group relative rounded-2xl border border-zinc-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:border-zinc-200/60 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                      Ref: {tender.ref}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                        tender.type === "Government" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                      }`}>
                        {tender.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        {tender.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-[#101D2D] transition-colors group-hover:text-[#FF6B2B]">
                    {tender.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                    {tender.desc}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-zinc-100 pt-5 text-xs text-zinc-500 sm:grid-cols-5">
                    <div>
                      <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[10px]">Procuring Entity</span>
                      <span className="mt-1 block font-bold text-[#101D2D]">{tender.procuringEntity}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[10px]">Budget Est.</span>
                      <span className="mt-1 block font-bold text-[#101D2D] text-sm">{tender.budget}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[10px]">Sector</span>
                      <span className="mt-1 block text-zinc-800 font-semibold">{tender.sector}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[10px]">LGA Location</span>
                      <span className="mt-1 block text-zinc-800 font-semibold">{tender.location}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-zinc-400 uppercase tracking-wide text-[10px]">Deadline</span>
                      <span className="mt-1 block text-[#FF6B2B] font-bold">{tender.deadline}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end">
                    <Link href={`/projects/${tender.slug || tender.id}`} className="rounded-xl bg-[#FF6B2B] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#FF6B2B]/10 transition-all hover:bg-[#E55F23] hover:shadow-[#E55F23]/25 active:translate-y-0">
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center">
                <p className="text-sm text-zinc-500">No tenders matches your current search filters.</p>
              </div>
            )}

            {/* Pagination */}
            {filteredTenders.length > 0 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#101D2D] text-white text-xs font-bold shadow-md">1</button>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-zinc-600 text-xs font-bold hover:bg-zinc-100 transition-colors border border-zinc-100">2</button>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-zinc-600 text-xs font-bold hover:bg-zinc-100 transition-colors border border-zinc-100">3</button>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-zinc-600 text-xs font-bold hover:bg-zinc-100 transition-colors border border-zinc-100">&gt;</button>
              </div>
            )}
          </div>

          {/* Right 1 Col: Widgets */}
          <div className="space-y-8">
            {/* AI Assistant Widget */}
            <div className="rounded-2xl border border-zinc-150 bg-[#101D2D] p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br from-[#FF6B2B]/20 to-transparent blur-2xl" />
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#FF6B2B] shadow-inner backdrop-blur-md">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-bold">Bid Assistant</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  Need help navigating the requirements? Our AI assistant can review your documents and ensure compliance before submission.
                </p>

                {aiAnalysisResult && (
                  <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3.5 text-xs text-zinc-200 leading-normal">
                    {aiAnalysisResult}
                  </div>
                )}

                <button 
                  onClick={handleStartCompliance}
                  disabled={analyzing}
                  className="mt-5 flex w-full h-11 items-center justify-center rounded-xl bg-[#FF6B2B] text-xs font-bold text-white shadow-md shadow-[#FF6B2B]/10 transition-all hover:bg-[#E55F23] disabled:opacity-60"
                >
                  {analyzing ? "Analyzing Document..." : "Start Compliance Check"}
                </button>
              </div>
            </div>
 

            {/* Premium Quick Stats Widget */}
            {/* <div className="grid grid-cols-2 gap-4">
              <div className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-zinc-200">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 transition-colors group-hover:bg-[#101D2D] group-hover:text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Value</span>
                  <span className="mt-1 block text-xl font-black text-[#101D2D]">₦--</span>
                </div>
              </div>
              
              <div className="group relative overflow-hidden rounded-2xl bg-[#101D2D] p-5 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#FF6B2B]/40 to-transparent blur-xl transition-all group-hover:scale-110" />
                <div className="relative">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-[#FF6B2B] shadow-inner backdrop-blur-md">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Open Tenders</span>
                  <span className="mt-1 flex items-baseline gap-1 text-xl font-black text-white">
                    {tenders.length}
                    <span className="text-xs font-semibold text-[#FF6B2B]">Active</span>
                  </span>
                </div>
              </div>
            </div> */}

          </div>

        </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
