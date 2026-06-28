"use client";

import React, { useEffect, useState } from "react";
import api from "@/src/lib/axios";

interface Procurement {
  id: string;
  contractor: string | null;
  entityType: string | null;
  state: string | null;
  lga: string | null;
  amount: string | null;
  awardDate: string | null;
  status: string;
  description: string | null;
}

export default function AdminProcurementsPage() {
  const [procurements, setProcurements] = useState<Procurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    contractor: "",
    entityType: "",
    state: "",
    lga: "",
    amount: "",
    awardDate: "",
    status: "active",
    description: ""
  });

  const fetchProcurements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/procurements');
      if (response.data.success) {
        setProcurements(response.data.data);
      } else {
        setError(response.data.message || "Failed to load procurements");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while fetching procurements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcurements();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await api.post('/procurements', formData);
      if (response.data.success) {
        setIsModalOpen(false);
        setFormData({
          contractor: "",
          entityType: "",
          state: "",
          lga: "",
          amount: "",
          awardDate: "",
          status: "active",
          description: ""
        });
        fetchProcurements();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create procurement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Procurement Registry</h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Manage and view government procurements and awarded contracts.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-lg bg-mod-primary px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Procurement
        </button>
      </div>

      <div className="rounded-[18px] border border-slate-100 bg-white shadow-sm overflow-hidden mt-8">
        <div className="border-b border-slate-100 px-6 py-5 bg-white">
          <h2 className="text-lg font-semibold text-slate-800">All Procurements ({procurements.length})</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-mod-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500 font-medium">
            {error}
          </div>
        ) : procurements.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            No procurements found in the registry.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Contractor</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Type / Location</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Award Date</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {procurements.map((procurement) => (
                  <tr key={procurement.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {procurement.contractor || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{procurement.entityType || 'N/A'}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{[procurement.lga, procurement.state].filter(Boolean).join(', ')}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{procurement.amount ? `₦${Number(procurement.amount).toLocaleString()}` : 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {procurement.awardDate ? new Date(procurement.awardDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                        procurement.status === 'active' ? 'bg-[#13DEB9]/10 text-[#13DEB9]' : 
                        procurement.status === 'completed' ? 'bg-mod-primary/10 text-mod-primary' : 
                        procurement.status === 'cancelled' ? 'bg-[#FA896B]/10 text-[#FA896B]' : 
                        'bg-[#FFAE1F]/10 text-[#FFAE1F]'
                      }`}>
                        {procurement.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Add Procurement</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <form id="procurement-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-slate-700 mb-1.5">Contractor Name</label>
                    <input 
                      required
                      type="text" 
                      name="contractor"
                      value={formData.contractor}
                      onChange={handleInputChange}
                      className="rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-mod-primary focus:bg-white focus:ring-2 focus:ring-mod-primary/20 transition-all outline-none"
                      placeholder="e.g. Julius Berger"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-slate-700 mb-1.5">Entity Type</label>
                    <input 
                      type="text" 
                      name="entityType"
                      value={formData.entityType}
                      onChange={handleInputChange}
                      className="rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-mod-primary focus:bg-white focus:ring-2 focus:ring-mod-primary/20 transition-all outline-none"
                      placeholder="e.g. Construction"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-slate-700 mb-1.5">State</label>
                    <input 
                      type="text" 
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-mod-primary focus:bg-white focus:ring-2 focus:ring-mod-primary/20 transition-all outline-none"
                      placeholder="e.g. Lagos"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-slate-700 mb-1.5">LGA</label>
                    <input 
                      type="text" 
                      name="lga"
                      value={formData.lga}
                      onChange={handleInputChange}
                      className="rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-mod-primary focus:bg-white focus:ring-2 focus:ring-mod-primary/20 transition-all outline-none"
                      placeholder="e.g. Ikeja"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-slate-700 mb-1.5">Amount (₦)</label>
                    <input 
                      type="number" 
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-mod-primary focus:bg-white focus:ring-2 focus:ring-mod-primary/20 transition-all outline-none"
                      placeholder="e.g. 5000000"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-slate-700 mb-1.5">Award Date</label>
                    <input 
                      type="date" 
                      name="awardDate"
                      value={formData.awardDate}
                      onChange={handleInputChange}
                      className="rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-mod-primary focus:bg-white focus:ring-2 focus:ring-mod-primary/20 transition-all outline-none"
                    />
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <label className="text-sm font-bold text-slate-700 mb-1.5">Status</label>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-mod-primary focus:bg-white focus:ring-2 focus:ring-mod-primary/20 transition-all outline-none"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="suspended">Suspended</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <label className="text-sm font-bold text-slate-700 mb-1.5">Description</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-mod-primary focus:bg-white focus:ring-2 focus:ring-mod-primary/20 transition-all outline-none resize-none"
                      placeholder="Brief description of the procurement"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 mt-auto">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="procurement-form"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-lg bg-mod-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Procurement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
