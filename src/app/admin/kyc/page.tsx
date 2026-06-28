"use client";

import React, { useEffect, useState } from "react";
import api from "@/src/lib/axios";
import KycReviewModal, { KYC } from "./KycReviewModal";

export default function AdminKYCPage() {
  const [kycs, setKycs] = useState<KYC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedKyc, setSelectedKyc] = useState<KYC | null>(null);

  const fetchKycs = async () => {
    try {
      const response = await api.get('/kyc/all');
      if (response.data.success) {
        setKycs(response.data.data);
      } else {
        setError(response.data.message || "Failed to load KYC applications");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while fetching KYC applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycs();
  }, []);

  const handleUpdate = () => {
    setSelectedKyc(null);
    setLoading(true);
    fetchKycs();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">KYC Verifications</h1>
          <p className="mt-1.5 text-sm font-medium text-slate-500">
            Review and approve business profiles submitted for compliance.
          </p>
        </div>
      </div>

      <div className="rounded-[18px] border border-slate-100 bg-white shadow-sm overflow-hidden mt-8">
        <div className="border-b border-slate-100 px-6 py-5 bg-white">
          <h2 className="text-lg font-semibold text-slate-800">KYC Compliance Queue ({kycs.length})</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-mod-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500 font-medium">
            {error}
          </div>
        ) : kycs.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            No KYC applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-xs uppercase text-slate-500 border-b border-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Applicant Name</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Industry</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {kycs.map((kyc) => (
                  <tr key={kyc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {kyc.type === 'business' ? kyc.businessName : `${kyc.firstName} ${kyc.lastName}`}
                    </td>
                    <td className="px-6 py-4 text-slate-500 capitalize">{kyc.type}</td>
                    <td className="px-6 py-4 text-slate-500">{kyc.email}</td>
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
                      <button 
                        onClick={() => setSelectedKyc(kyc)}
                        className="text-mod-primary font-semibold hover:text-blue-700"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedKyc && (
        <KycReviewModal
          kyc={selectedKyc}
          onClose={() => setSelectedKyc(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
