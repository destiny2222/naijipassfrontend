"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { getVerifiedBusinessesDirectory } from "@/src/services/kyc/kyc";

export default function BusinessDirectoryPage() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState < any[] > ([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState < any | null > (null);

  useEffect(() => {
    const fetchDirectory = async () => {
      setLoading(true);
      try {
        const res = await getVerifiedBusinessesDirectory();
        if (res.success && res.data) {
          setBusinesses(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch verified businesses", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDirectory();
    }
  }, [user]);

  const filteredBusinesses = businesses.filter(biz =>
    biz.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    biz.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto w-full">

          {/* Header text & Search */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black sm:text-3xl">
                Business Directory
              </h1>
              <p className="mt-1.5 text-xs font-medium text-zinc-400">
                Browse all verified and approved contractors and businesses on NaijaPass.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search businesses or industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-xs font-semibold text-zinc-800 placeholder-zinc-400 shadow-sm outline-none transition-all focus:border-[#FF6B2B]/60 focus:ring-1 focus:ring-[#FF6B2B]/60"
              />
            </div>
          </div>

          {/* Directory Grid */}
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-100 bg-white">
              <div className="text-sm font-medium text-zinc-400">Loading directory...</div>
            </div>
          ) : filteredBusinesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBusinesses.map((biz) => (
                <div key={biz.id} className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
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
                      Joined {new Date(biz.verifiedAt || biz.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => setSelectedBusiness(biz)}
                      className="text-xs font-bold text-[#FF6B2B] group-hover:text-[#E55F23] flex items-center gap-1 transition-colors"
                    >
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
            <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-100 bg-white p-12 text-center shadow-sm">
              <svg className="mb-4 h-12 w-12 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-bold text-[#101D2D]">No businesses found</h3>
              <p className="mt-1 text-sm text-zinc-500">We couldn't find any verified businesses matching your criteria.</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 rounded-xl bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Business Details Modal */}
          {selectedBusiness && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl relative">
                <button
                  onClick={() => setSelectedBusiness(null)}
                  className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 text-[#101D2D] font-black text-2xl">
                    {selectedBusiness.businessName?.charAt(0) || "B"}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#101D2D]">{selectedBusiness.businessName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                        {selectedBusiness.industryCategory?.name || selectedBusiness.industry || "Business"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-zinc-100 p-4 bg-zinc-50/50">
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Email Address</span>
                      <span className="block text-sm font-semibold text-[#101D2D]">{selectedBusiness.email}</span>
                    </div>
                    <div className="rounded-xl border border-zinc-100 p-4 bg-zinc-50/50">
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Phone Number</span>
                      <span className="block text-sm font-semibold text-[#101D2D]">{selectedBusiness.phoneNumber}</span>
                    </div>
                  </div>

                  {/* Company Info */}
                  <div>
                    <h4 className="text-sm font-bold text-[#101D2D] mb-3">Company Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-zinc-100 p-4">
                        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Registration (RC)</span>
                        <span className="block text-sm font-semibold text-[#101D2D]">{selectedBusiness.registrationNumber || "N/A"}</span>
                      </div>
                      <div className="rounded-xl border border-zinc-100 p-4">
                        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Business Type</span>
                        <span className="block text-sm font-semibold text-[#101D2D]">{selectedBusiness.businessType || "N/A"}</span>
                      </div>
                      <div className="sm:col-span-2 rounded-xl border border-zinc-100 p-4">
                        <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Registered Address</span>
                        <span className="block text-sm font-semibold text-[#101D2D]">{selectedBusiness.registeredAddress || selectedBusiness.businessAddress || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Person */}
                  {(selectedBusiness.contactPersonName || selectedBusiness.contactPersonEmail) && (
                    <div>
                      <h4 className="text-sm font-bold text-[#101D2D] mb-3">Primary Contact</h4>
                      <div className="rounded-xl border border-zinc-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div>
                          <span className="block text-sm font-semibold text-[#101D2D]">{selectedBusiness.contactPersonName || "N/A"}</span>
                          <span className="block text-xs font-medium text-zinc-500 mt-0.5">{selectedBusiness.contactPersonEmail || "No email provided"}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Representatives */}
                  {selectedBusiness.representatives && selectedBusiness.representatives.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-[#101D2D] mb-3">Board Members & Representatives</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedBusiness.representatives.map((rep: any) => (
                          <div key={rep.id} className="rounded-xl border border-zinc-100 p-3 bg-white shadow-sm flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500">
                              {rep.name.charAt(0)}
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-[#101D2D]">{rep.name}</span>
                              <span className="block text-[10px] font-medium text-zinc-500">{rep.position}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

    </div>
  );
}
