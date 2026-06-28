import React, { useState } from 'react';
import api from '@/src/lib/axios';
import { toast } from 'react-hot-toast';

export interface KYC {
  id: string;
  type: string;
  businessName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  registrationNumber: string | null;
  taxIdentificationNumber: string | null;
  status: string;
  rejectionReason: string | null;
  industryCategoryId: number | null;
  industryCategory: { id: number; name: string } | null;
  idType: string | null;
  idNumber: string | null;
  dob: string | null;
  nationality: string | null;
  residentialAddress: string | null;
  businessType: string | null;
  businessAddress: string | null;
  idDocument: string | null;
  proofOfAddress: string | null;
  certificateOfIncorporation: string | null;
  memorandumArticles: string | null;
}

interface KycReviewModalProps {
  kyc: KYC;
  onClose: () => void;
  onUpdate: () => void;
}

export default function KycReviewModal({ kyc, onClose, onUpdate }: KycReviewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<KYC>>(kyc);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState(kyc.rejectionReason || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusUpdate = async (status: string) => {
    if (status === 'rejected' && !rejectionReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    
    setLoading(true);
    try {
      const payload = isEditing ? { ...formData, status, rejectionReason } : { status, rejectionReason };
      
      const response = await api.put(`/kyc/review/${kyc.id}`, payload);
      if (response.data.success) {
        toast.success(`KYC ${status} successfully`);
        onUpdate();
      } else {
        toast.error(response.data.message || 'Failed to update KYC');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Review KYC: {kyc.type === 'business' ? kyc.businessName : `${kyc.firstName} ${kyc.lastName}`}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm font-semibold text-mod-primary hover:text-blue-700"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Details'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Type</label>
              <input disabled value={kyc.type} className="mt-1 block w-full rounded-md border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 capitalize" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Email</label>
              <input disabled value={kyc.email} className="mt-1 block w-full rounded-md border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" />
            </div>

            {kyc.type === 'business' ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Business Name</label>
                  <input name="businessName" disabled={!isEditing} value={formData.businessName || ''} onChange={handleChange} className={`mt-1 block w-full rounded-md px-3 py-2 text-sm ${isEditing ? 'border border-mod-primary bg-white focus:ring-1 focus:ring-mod-primary' : 'border-slate-200 bg-slate-50 text-slate-600'}`} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Registration Number</label>
                  <input name="registrationNumber" disabled={!isEditing} value={formData.registrationNumber || ''} onChange={handleChange} className={`mt-1 block w-full rounded-md px-3 py-2 text-sm ${isEditing ? 'border border-mod-primary bg-white focus:ring-1 focus:ring-mod-primary' : 'border-slate-200 bg-slate-50 text-slate-600'}`} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Business Type</label>
                  <input name="businessType" disabled={!isEditing} value={formData.businessType || ''} onChange={handleChange} className={`mt-1 block w-full rounded-md px-3 py-2 text-sm ${isEditing ? 'border border-mod-primary bg-white focus:ring-1 focus:ring-mod-primary' : 'border-slate-200 bg-slate-50 text-slate-600'}`} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Business Address</label>
                  <input name="businessAddress" disabled={!isEditing} value={formData.businessAddress || ''} onChange={handleChange} className={`mt-1 block w-full rounded-md px-3 py-2 text-sm ${isEditing ? 'border border-mod-primary bg-white focus:ring-1 focus:ring-mod-primary' : 'border-slate-200 bg-slate-50 text-slate-600'}`} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">First Name</label>
                  <input name="firstName" disabled={!isEditing} value={formData.firstName || ''} onChange={handleChange} className={`mt-1 block w-full rounded-md px-3 py-2 text-sm ${isEditing ? 'border border-mod-primary bg-white focus:ring-1 focus:ring-mod-primary' : 'border-slate-200 bg-slate-50 text-slate-600'}`} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Last Name</label>
                  <input name="lastName" disabled={!isEditing} value={formData.lastName || ''} onChange={handleChange} className={`mt-1 block w-full rounded-md px-3 py-2 text-sm ${isEditing ? 'border border-mod-primary bg-white focus:ring-1 focus:ring-mod-primary' : 'border-slate-200 bg-slate-50 text-slate-600'}`} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">ID Type</label>
                  <input name="idType" disabled={!isEditing} value={formData.idType || ''} onChange={handleChange} className={`mt-1 block w-full rounded-md px-3 py-2 text-sm ${isEditing ? 'border border-mod-primary bg-white focus:ring-1 focus:ring-mod-primary' : 'border-slate-200 bg-slate-50 text-slate-600'}`} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">ID Number</label>
                  <input name="idNumber" disabled={!isEditing} value={formData.idNumber || ''} onChange={handleChange} className={`mt-1 block w-full rounded-md px-3 py-2 text-sm ${isEditing ? 'border border-mod-primary bg-white focus:ring-1 focus:ring-mod-primary' : 'border-slate-200 bg-slate-50 text-slate-600'}`} />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
              <input name="phoneNumber" disabled={!isEditing} value={formData.phoneNumber || ''} onChange={handleChange} className={`mt-1 block w-full rounded-md px-3 py-2 text-sm ${isEditing ? 'border border-mod-primary bg-white focus:ring-1 focus:ring-mod-primary' : 'border-slate-200 bg-slate-50 text-slate-600'}`} />
            </div>
            
            {kyc.industryCategory && (
              <div>
                <label className="block text-sm font-semibold text-slate-700">Industry Category</label>
                <input disabled value={kyc.industryCategory.name} className="mt-1 block w-full rounded-md border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-semibold text-slate-800 mb-4">Uploaded Documents</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kyc.idDocument && (
                <a href={kyc.idDocument} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-mod-primary hover:bg-slate-50 transition-colors">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-slate-700 truncate">ID Document</span>
                    <span className="text-xs text-mod-primary">View File</span>
                  </div>
                </a>
              )}
              {kyc.proofOfAddress && (
                <a href={kyc.proofOfAddress} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-mod-primary hover:bg-slate-50 transition-colors">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-slate-700 truncate">Proof of Address</span>
                    <span className="text-xs text-mod-primary">View File</span>
                  </div>
                </a>
              )}
              {kyc.certificateOfIncorporation && (
                <a href={kyc.certificateOfIncorporation} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-mod-primary hover:bg-slate-50 transition-colors">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-slate-700 truncate">Certificate of Incorporation</span>
                    <span className="text-xs text-mod-primary">View File</span>
                  </div>
                </a>
              )}
              {kyc.memorandumArticles && (
                <a href={kyc.memorandumArticles} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-mod-primary hover:bg-slate-50 transition-colors">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-slate-700 truncate">Memorandum Articles</span>
                    <span className="text-xs text-mod-primary">View File</span>
                  </div>
                </a>
              )}
            </div>
            {!kyc.idDocument && !kyc.proofOfAddress && !kyc.certificateOfIncorporation && !kyc.memorandumArticles && (
              <p className="text-sm text-slate-500">No documents uploaded.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Rejection Reason (if rejecting)</label>
            <textarea 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Provide a reason if you are rejecting this application..."
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-mod-primary focus:ring-1 focus:ring-mod-primary"
              rows={3}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          {isEditing ? (
             <button 
             onClick={() => handleStatusUpdate(kyc.status)}
             disabled={loading}
             className="px-4 py-2 text-sm font-semibold text-white bg-mod-primary hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
           >
             {loading ? 'Processing...' : 'Save Changes Only'}
           </button>
          ) : null}
          <button 
            onClick={() => handleStatusUpdate('rejected')}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
          >
            {loading ? 'Processing...' : 'Reject'}
          </button>
          <button 
            onClick={() => handleStatusUpdate('approved')}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#13DEB9] hover:bg-[#10c9a7] rounded-lg transition-colors shadow-sm"
          >
            {loading ? 'Processing...' : (isEditing ? 'Save & Approve' : 'Approve')}
          </button>
        </div>
      </div>
    </div>
  );
}
