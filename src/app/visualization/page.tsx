"use client";

import { useState } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Breadcrumb from "@/src/components/Breadcrumb";

interface Document {
  id: string;
  title: string;
  category: "Policy" | "Infrastructure" | "Document" | "Finance";
  date: string;
}

export default function VisualizationPage() {
  const [docSearch, setDocSearch] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const documents: Document[] = [
    {
      id: "1",
      title: "Kano State Procurement Guidelines 2026",
      category: "Policy",
      date: "Oct 12, 2026",
    },
    {
      id: "2",
      title: "Urban Development Masterplan Phase II",
      category: "Infrastructure",
      date: "Sep 08, 2026",
    },
    {
      id: "3",
      title: "Environmental Impact Assessment Template",
      category: "Document",
      date: "Aug 22, 2026",
    },
    {
      id: "4",
      title: "Digital Tax Reforms Policy V2.1",
      category: "Finance",
      date: "Jul 19, 2026",
    },
  ];

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(docSearch.toLowerCase())
  );

  const handleDownload = (id: string, title: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Mock download started for: ${title}`);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50">
      <Navbar />

      <main className="flex-grow">
        
        <Breadcrumb />

        {/* Content Section Columns */}
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Left Column: Regulatory Library */}
            <div className="lg:col-span-2 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 border-b border-zinc-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#101D2D]">Regulatory Library</h3>
                  <p className="text-xs text-zinc-400">Search and download state policies, guides, and templates.</p>
                </div>
                <div className="relative w-full sm:w-60">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                    <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Search documents..."
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2 px-9 text-xs text-zinc-800 placeholder-zinc-400 outline-none focus:border-[#FF6B2B]/60 focus:bg-white"
                  />
                </div>
              </div>

              {/* Document List Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      <th className="pb-3 pr-4">Document Title</th>
                      <th className="pb-3 px-4">Category</th>
                      <th className="pb-3 px-4">Date Published</th>
                      <th className="pb-3 pl-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {filteredDocs.map((doc) => (
                      <tr key={doc.id} className="group hover:bg-zinc-50/80 transition-colors">
                        <td className="py-4 pr-4 font-bold text-[#101D2D] max-w-[260px] truncate">
                          {doc.title}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold ${
                            doc.category === "Policy" ? "bg-blue-50 text-blue-700" :
                            doc.category === "Infrastructure" ? "bg-purple-50 text-purple-700" :
                            doc.category === "Document" ? "bg-red-50 text-red-700" :
                            "bg-emerald-50 text-emerald-700"
                          }`}>
                            {doc.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-zinc-500 font-medium">{doc.date}</td>
                        <td className="py-4 pl-4 text-right">
                          <button
                            onClick={() => handleDownload(doc.id, doc.title)}
                            disabled={downloadingId !== null}
                            className="inline-flex p-2 rounded-xl text-zinc-500 hover:text-[#FF6B2B] hover:bg-[#FF6B2B]/5 transition-all focus:outline-none"
                            aria-label="Download Document"
                          >
                            {downloadingId === doc.id ? (
                              <svg className="h-4.5 w-4.5 animate-spin text-[#FF6B2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                                <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
                              </svg>
                            ) : (
                              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredDocs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-zinc-400 font-medium">
                          No documentation matches your request.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Infrastructure Pulse & MDAs */}
            <div className="space-y-8">
              
              {/* Infrastructure Pulse */}
              <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#101D2D]">Infrastructure Pulse</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Live operational status of critical state utilities.</p>
                
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-50 pb-3.5">
                    <div>
                      <span className="block text-xs font-bold text-zinc-800">Grid Power Supply</span>
                      <span className="mt-0.5 text-[11px] font-semibold text-zinc-400">84% Capacity</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Operational
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-zinc-50 pb-3.5">
                    <div>
                      <span className="block text-xs font-bold text-zinc-800">Municipal Water</span>
                      <span className="mt-0.5 text-[11px] font-semibold text-zinc-400">Pumping Station 4</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                      Maintenance
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-zinc-800">Major Arteries</span>
                      <span className="mt-0.5 text-[11px] font-semibold text-zinc-400">Zaria Road & Expressway</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      92% Open
                    </span>
                  </div>
                </div>

                <a href="#pulse" className="mt-5 block text-center text-xs font-bold text-[#FF6B2B] hover:text-[#E55F23] hover:underline pt-2 border-t border-zinc-100">
                  View Detailed Analytics
                </a>
              </div>

              {/* Key MDAs Directory */}
              <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#101D2D]">Key MDAs Directory</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Quick connection details for state ministries.</p>

                <div className="mt-5 space-y-4">
                  <div className="rounded-xl bg-zinc-50/50 p-3.5 border border-zinc-100 hover:border-zinc-200 transition-colors">
                    <h4 className="text-xs font-bold text-[#101D2D]">Ministry of Works & Infrastructure</h4>
                    <div className="mt-2 text-[11px] font-semibold text-zinc-500 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        +234 803 123 4567
                      </p>
                      <p className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        info@mow.kn.gov.ng
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-zinc-50/50 p-3.5 border border-zinc-100 hover:border-zinc-200 transition-colors">
                    <h4 className="text-xs font-bold text-[#101D2D]">State Water Board</h4>
                    <div className="mt-2 text-[11px] font-semibold text-zinc-500 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        +234 805 765 4321
                      </p>
                      <p className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        contact@waterboard.kn.gov.ng
                      </p>
                    </div>
                  </div>
                </div>

                <a href="#directory" className="mt-5 block text-center text-xs font-bold text-[#FF6B2B] hover:text-[#E55F23] hover:underline pt-2 border-t border-zinc-100">
                  View Full Directory
                </a>
              </div>

            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
