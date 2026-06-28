"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddRegistryEntryPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    lga: "",
    state: "Edo State",
    city: "",
    entityType: "State Government",
    companyName: "",
    status: "active",
    sector: "",
    amount: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock API call to save to backend procurementsTable
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/gov/registry");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/gov/registry" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Add Procurement Entry</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manually add an awarded contract to the public registry.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Contract Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Company / Contractor Name</label>
                <input 
                  type="text" 
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Julius Berger"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm outline-none focus:border-green-700/60 focus:bg-white" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Contract Amount (₦)</label>
                <input 
                  type="text" 
                  name="amount"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 450000000"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm outline-none focus:border-green-700/60 focus:bg-white" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Sector / Category</label>
                <select 
                  name="sector"
                  required
                  value={formData.sector}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm outline-none focus:border-green-700/60 focus:bg-white"
                >
                  <option value="">Select Sector...</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Technology">Technology</option>
                  <option value="Agriculture">Agriculture</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm outline-none focus:border-green-700/60 focus:bg-white"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Location & Entity</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
                <input 
                  type="text" 
                  name="state"
                  disabled
                  value={formData.state}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 py-3 px-4 text-sm text-slate-500 cursor-not-allowed outline-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">LGA</label>
                <input 
                  type="text" 
                  name="lga"
                  required
                  value={formData.lga}
                  onChange={handleChange}
                  placeholder="e.g. Oredo"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm outline-none focus:border-green-700/60 focus:bg-white" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">City</label>
                <input 
                  type="text" 
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Benin City"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm outline-none focus:border-green-700/60 focus:bg-white" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Entity Type</label>
                <select 
                  name="entityType"
                  value={formData.entityType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm outline-none focus:border-green-700/60 focus:bg-white"
                >
                  <option value="State Government">State Government</option>
                  <option value="Local Government">Local Government</option>
                  <option value="Federal Agency">Federal Agency</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <Link 
              href="/gov/registry"
              className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl font-bold text-white bg-green-700 hover:bg-green-800 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Entry...
                </>
              ) : (
                "Save Entry to Registry"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
