"use client";

import { useState, useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Breadcrumb from "@/src/components/Breadcrumb";
import { getBids } from "@/src/services/bids/bids";
import { analyzeCompliance } from "@/src/services/assistant";
import { useAuth } from "@/src/hooks/useAuth";
import Link from "next/link";
import { Search, Filter, Bot, BarChart3, TrendingUp, Building2, Calendar, MapPin, Briefcase } from "lucide-react";

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
  const [question, setQuestion] = useState("");
  const { user } = useAuth();

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

  const handleStartCompliance = async () => {
    setAnalyzing(true);
    setAiAnalysisResult(null);
    try {
      const result = await analyzeCompliance(question);
      if (result.success && result.analysis) {
        setAiAnalysisResult(result.analysis);
        setQuestion(""); // Clear question on success
      } else {
        setAiAnalysisResult(result.message || "Failed to analyze compliance.");
      }
    } catch (error) {
      setAiAnalysisResult("An error occurred during AI analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50">
      <Navbar />

      <main className="flex-grow">
        <Breadcrumb />
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0088FF]/20 bg-[#0088FF]/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0088FF] mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0088FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0088FF]"></span>
              </span>
              Procurement & Open Contracting
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#101D2D] sm:text-5xl">
              Open Tenders & Opportunities
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500 font-medium max-w-3xl">
              Explore, filter, and bid on active infrastructure and service projects across the state.
              Ensuring transparency, accessibility, and competitive procurement for all contractors.
            </p>
          </div>
        </div>

        {/* Filter bar - Sleek Glassmorphism */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-3xl border border-zinc-200/60 bg-white/70 backdrop-blur-xl p-3 shadow-sm">
          {/* Left: Filter Buttons */}
          <div className="flex flex-wrap items-center gap-3 pl-2">
            <Filter className="h-4 w-4 text-zinc-400" />
            <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-zinc-400">Filters:</span>
            
            {/* Sector */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="rounded-2xl border-none bg-zinc-100/80 py-2.5 px-4 text-xs font-bold text-[#101D2D] outline-none transition-all hover:bg-zinc-200/80 focus:ring-2 focus:ring-[#0088FF]/20 cursor-pointer"
            >
              <option value="All">All Sectors</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Education & Tech">Education & Tech</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
            </select>

            {/* Location */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="rounded-2xl border-none bg-zinc-100/80 py-2.5 px-4 text-xs font-bold text-[#101D2D] outline-none transition-all hover:bg-zinc-200/80 focus:ring-2 focus:ring-[#0088FF]/20 cursor-pointer"
            >
              <option value="All">All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Right: Search */}
          <div className="relative w-full lg:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tenders, refs, agencies..."
              className="block w-full rounded-2xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-[#0088FF] focus:ring-2 focus:ring-[#0088FF]/20 shadow-sm"
            />
          </div>
        </div>

        {/* Content Split Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Left 2 Cols: Tender List */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-zinc-200 bg-white py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0088FF]"></div>
                <p className="mt-4 text-sm font-semibold text-zinc-500">Loading open tenders...</p>
              </div>
            ) : filteredTenders.length > 0 ? (
              filteredTenders.map((tender) => (
                <div 
                  key={tender.id}
                  className="group relative overflow-hidden rounded-[2rem] border border-zinc-100 bg-white p-1 transition-all duration-300 hover:shadow-2xl hover:shadow-[#0088FF]/5 hover:-translate-y-1"
                >
                  {/* Subtle hover gradient border effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0088FF]/0 to-[#0088FF]/0 opacity-0 transition-opacity duration-300 group-hover:from-[#0088FF]/5 group-hover:to-transparent group-hover:opacity-100" />
                  
                  <div className="relative rounded-[1.8rem] bg-white p-6 sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <Briefcase className="h-3 w-3" />
                        Ref: {tender.ref}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
                          tender.type === "Government" ? "bg-blue-50 text-[#0088FF]" : "bg-purple-50 text-purple-700"
                        }`}>
                          {tender.type}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {tender.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-5 text-xl font-black text-[#101D2D] transition-colors group-hover:text-[#0088FF]">
                      {tender.title}
                    </h3>
                    <p className="mt-3 text-sm text-zinc-500 leading-relaxed font-medium line-clamp-2">
                      {tender.desc}
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-4">
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                          <Building2 className="h-3.5 w-3.5" />
                          Agency
                        </span>
                        <span className="block text-sm font-bold text-[#101D2D] truncate" title={tender.procuringEntity}>{tender.procuringEntity}</span>
                      </div>
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                          <BarChart3 className="h-3.5 w-3.5" />
                          Sector
                        </span>
                        <span className="block text-sm font-bold text-zinc-700 truncate">{tender.sector}</span>
                      </div>
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                          <MapPin className="h-3.5 w-3.5" />
                          Location
                        </span>
                        <span className="block text-sm font-bold text-zinc-700 truncate">{tender.location}</span>
                      </div>
                      <div>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Deadline
                        </span>
                        <span className="block text-sm font-bold text-[#0088FF]">{tender.deadline}</span>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end">
                      <Link href={`/projects/${tender.slug || tender.id}`} className="group/btn inline-flex items-center gap-2 rounded-2xl bg-[#0088FF] px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(0,136,255,0.3)] transition-all hover:bg-[#0070D1] hover:shadow-[0_0_25px_rgba(0,136,255,0.4)] hover:-translate-y-0.5">
                        View Details
                        <svg className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-zinc-200 bg-white py-20 text-center">
                <Search className="h-10 w-10 text-zinc-300 mb-4" />
                <h3 className="text-lg font-bold text-[#101D2D]">No Tenders Found</h3>
                <p className="mt-2 text-sm font-medium text-zinc-500 max-w-md mx-auto">
                  We couldn't find any projects matching your current filters. Try adjusting your search criteria or selecting "All".
                </p>
                <button 
                  onClick={() => { setSelectedSector("All"); setSelectedLocation("All"); setSelectedSource("All"); setSearchQuery(""); }}
                  className="mt-6 rounded-xl bg-zinc-100 px-5 py-2.5 text-xs font-bold text-zinc-600 transition-colors hover:bg-zinc-200"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Right 1 Col: Widgets */}
          <div className="space-y-6">
            
            {/* AI Assistant Widget - Modernized */}
            <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#101D2D] to-[#1a2b42] p-8 text-white shadow-xl">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#0088FF]/30 blur-[40px] transition-all duration-700 group-hover:bg-[#0088FF]/50 group-hover:scale-150" />
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 shadow-inner backdrop-blur-md border border-white/5">
                  <Bot className="h-7 w-7 text-[#0088FF]" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Bid Assistant AI</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-400">
                  Instantly analyze your company profile against active tenders to check your pre-requisite compliance and win-rate probability.
                </p>

                {aiAnalysisResult && (
                  <div className="mt-6 rounded-2xl bg-[#0088FF]/10 border border-[#0088FF]/20 p-4 text-sm font-semibold text-[#88c4ff] leading-relaxed backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <span className="flex items-center gap-2 mb-2 text-white">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      Analysis Complete
                    </span>
                    {aiAnalysisResult}
                  </div>
                )}

                <div className="mt-6">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about bidding, compliance, or your profile..."
                    className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0088FF]/50 resize-none transition-all"
                    rows={2}
                  />
                </div>

                <button 
                  onClick={handleStartCompliance}
                  disabled={analyzing}
                  className="mt-4 flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-[#0088FF] text-sm font-bold text-white shadow-[0_0_20px_rgba(0,136,255,0.3)] transition-all hover:bg-[#0070D1] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {analyzing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Analyzing...
                    </>
                  ) : question ? "Ask Assistant" : "Start Compliance Check"}
                </button>
              </div>
            </div>
 

            {/* Premium Quick Stats Widget */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group overflow-hidden rounded-[2rem] border border-zinc-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#0088FF]/30">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0088FF]/10 text-[#0088FF] transition-colors group-hover:bg-[#0088FF] group-hover:text-white">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Total Value</span>
                <span className="mt-1.5 block text-2xl font-black text-[#101D2D]">₦1.4B+</span>
              </div>
              
              <div className="group overflow-hidden rounded-[2rem] bg-white border border-zinc-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-emerald-500/30">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Open Tenders</span>
                <span className="mt-1.5 flex items-baseline gap-1 text-2xl font-black text-[#101D2D]">
                  {tenders.length}
                  <span className="text-xs font-bold text-emerald-600 ml-1">Active</span>
                </span>
              </div>
            </div>

          </div>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
