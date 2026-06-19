"use client";

import { useState } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Breadcrumb from "@/src/components/Breadcrumb";

interface Business {
  id: string;
  name: string;
  lga: string;
  desc: string;
  rating: number;
  verified: boolean;
  sector: string;
}

export default function TablesPage() {
  const [sectorFilters, setSectorFilters] = useState<string[]>([
    "Construction & Real Estate",
    "Tech & IT",
  ]);
  const [verificationFilters, setVerificationFilters] = useState<string[]>([
    "Verified",
  ]);
  const [selectedLga, setSelectedLga] = useState("");
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const businesses: Business[] = [
    {
      id: "1",
      name: "Apex Corp. Ltd",
      lga: "Oredo LGA, Edo State",
      desc: "Licensing and engineering firm specializing in road construction, concrete bridges, and civil works.",
      rating: 5,
      verified: true,
      sector: "Construction & Real Estate",
    },
    {
      id: "2",
      name: "Life line Med Supplies",
      lga: "Ovia LGA, Edo State",
      desc: "Authorized distributor of essential medical equipment, surgical supplies, and hospital infrastructure.",
      rating: 5,
      verified: true,
      sector: "Healthcare & Medical",
    },
    {
      id: "3",
      name: "TechFlow Solutions",
      lga: "Egor LGA, Edo State",
      desc: "Digital transformation agency providing custom software development, cloud services, and IT training.",
      rating: 5,
      verified: true,
      sector: "Tech & IT",
    },
    {
      id: "4",
      name: "Benin Heritage Catering",
      lga: "Oredo LGA, Edo State",
      desc: "Premium catering and event management services for large scale institutional conferences.",
      rating: 4,
      verified: false,
      sector: "Hospitality",
    },
  ];

  const handleSectorToggle = (sect: string) => {
    if (sectorFilters.includes(sect)) {
      setSectorFilters(sectorFilters.filter((s) => s !== sect));
    } else {
      setSectorFilters([...sectorFilters, sect]);
    }
  };

  const handleVerificationToggle = (status: string) => {
    if (verificationFilters.includes(status)) {
      setVerificationFilters(verificationFilters.filter((v) => v !== status));
    } else {
      setVerificationFilters([...verificationFilters, status]);
    }
  };

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSector = sectorFilters.length === 0 || sectorFilters.includes(b.sector);
    const matchesVerification =
      verificationFilters.length === 0 ||
      (verificationFilters.includes("Verified") && b.verified) ||
      (verificationFilters.includes("Pending") && !b.verified);
    const matchesLga = selectedLga === "" || b.lga.includes(selectedLga);

    return matchesSector && matchesVerification && matchesLga;
  });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50/50">
      <Navbar />

      <main className="flex-grow">
        <Breadcrumb />
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-150 pb-6 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B2B]">
              Verified Business Directory
            </span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#101D2D] sm:text-4xl">
              Verified Businesses
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Showing {filteredBusinesses.length} registered contractors and service providers across Edo State.
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#FF6B2B] px-5 text-sm font-semibold text-white shadow-md shadow-[#FF6B2B]/10 transition-all hover:bg-[#E55F23] hover:shadow-[#E55F23]/25 active:translate-y-0"
            >
              Register Business
            </button>
          </div>
        </div>

        {/* Layout Column Split */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Left Column Filters */}
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm self-start">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#101D2D]">Filters</span>
              <button 
                onClick={() => {
                  setSectorFilters([]);
                  setVerificationFilters([]);
                  setSelectedLga("");
                }}
                className="text-xs font-semibold text-[#FF6B2B] hover:text-[#E55F23]"
              >
                Clear All
              </button>
            </div>

            {/* VERIFICATION STATUS */}
            <div className="space-y-3 mb-6">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-405">Verification Status</h4>
              <div className="space-y-2">
                {[
                  { label: "Verified Businesses", value: "Verified" },
                  { label: "Pending Review", value: "Pending" },
                ].map((item) => (
                  <label key={item.value} className="flex items-center text-xs font-semibold text-zinc-650 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={verificationFilters.includes(item.value)}
                      onChange={() => handleVerificationToggle(item.value)}
                      className="h-4 w-4 rounded border-zinc-300 text-[#FF6B2B] focus:ring-[#FF6B2B] mr-2.5"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            {/* INDUSTRY SECTOR */}
            <div className="space-y-3 mb-6">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-405">Industry Sector</h4>
              <div className="space-y-2">
                {[
                  "Construction & Real Estate",
                  "Tech & IT",
                  "Healthcare & Medical",
                  "Hospitality",
                  "Agriculture & Farming",
                  "Education & Training",
                ].map((sector) => (
                  <label key={sector} className="flex items-center text-xs font-semibold text-zinc-650 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sectorFilters.includes(sector)}
                      onChange={() => handleSectorToggle(sector)}
                      className="h-4 w-4 rounded border-zinc-300 text-[#FF6B2B] focus:ring-[#FF6B2B] mr-2.5"
                    />
                    {sector}
                  </label>
                ))}
              </div>
            </div>

            {/* LOCAL GOV. AREA */}
            <div className="space-y-3 mb-6">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-405">Local Gov. Area (LGA)</h4>
              <select
                value={selectedLga}
                onChange={(e) => setSelectedLga(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 px-3 text-xs font-semibold text-zinc-700 outline-none focus:border-[#FF6B2B]/60 focus:bg-white"
              >
                <option value="">All LGAs</option>
                <option value="Oredo">Oredo LGA</option>
                <option value="Ovia">Ovia LGA</option>
                <option value="Egor">Egor LGA</option>
                <option value="Esan West">Esan West LGA</option>
              </select>
            </div>

            <button 
              onClick={() => {}}
              className="mt-2 w-full rounded-xl bg-[#101D2D] py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-opacity-95"
            >
              Apply Filters
            </button>
          </div>

          {/* Right Column Business Cards Grid */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredBusinesses.length > 0 ? (
                filteredBusinesses.map((biz) => (
                  <div
                    key={biz.id}
                    className="group rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-200/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-[#101D2D] text-base group-hover:text-[#FF6B2B] transition-colors">
                            {biz.name}
                          </h3>
                          {biz.verified ? (
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-orange-100 text-[#FF6B2B]">
                              <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[9px] font-bold text-zinc-400 uppercase tracking-wide">
                              Pending
                            </span>
                          )}
                        </div>
                        <span className="mt-1 block text-xs font-semibold text-zinc-400">
                          {biz.lga}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3.5 text-xs text-zinc-500 leading-relaxed min-h-[40px]">
                      {biz.desc}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
                      {/* Star Rating */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= biz.rating ? "text-amber-400" : "text-zinc-200"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <a
                        href="#profile"
                        className="text-xs font-bold text-[#FF6B2B] hover:text-[#E55F23] hover:underline"
                      >
                        View Profile &gt;
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 rounded-2xl border border-dashed border-zinc-200 bg-white p-12 text-center">
                  <p className="text-sm text-zinc-500">No businesses match your active filter parameters.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredBusinesses.length > 0 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 text-xs font-bold disabled:opacity-50" disabled>&lt;</button>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#101D2D] text-white text-xs font-bold shadow-md">1</button>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-zinc-650 text-xs font-bold hover:bg-zinc-100 transition-colors border border-zinc-100">2</button>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-zinc-650 text-xs font-bold hover:bg-zinc-100 transition-colors border border-zinc-100">&gt;</button>
              </div>
            )}
          </div>

        </div>
        </div>
      </main>

      {/* Register Business Modal Mockup */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101D2D]/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-extrabold text-[#101D2D] text-lg">Register Your Business</h3>
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); setShowRegisterModal(false); }} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Business Name</label>
                <input type="text" required placeholder="e.g. Benin Infrastructure Experts" className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 px-3 text-xs outline-none focus:border-[#FF6B2B]/60 focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Primary Sector</label>
                <select className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 px-3 text-xs outline-none focus:border-[#FF6B2B]/60 focus:bg-white">
                  <option>Construction & Real Estate</option>
                  <option>Tech & IT</option>
                  <option>Healthcare & Medical</option>
                  <option>Hospitality</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">CAC Registration Number</label>
                <input type="text" required placeholder="RC-1234567" className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 px-3 text-xs outline-none focus:border-[#FF6B2B]/60 focus:bg-white" />
              </div>
              
              <button type="submit" className="mt-3 flex w-full h-11 items-center justify-center rounded-xl bg-[#FF6B2B] text-xs font-bold text-white shadow-md shadow-[#FF6B2B]/10 hover:bg-[#E55F23]">
                Submit Registration
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
