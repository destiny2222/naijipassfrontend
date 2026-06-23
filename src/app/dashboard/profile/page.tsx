"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { getMyKycStatus } from "@/src/services/kyc/kyc";
import { updateProfileService, changePasswordService } from "@/src/services/profile/profile";
import toast, { Toaster } from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState < any > (null);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getMyKycStatus();
        if (res.success && res.data) {
          setProfileData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile details", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
      setEditForm({ name: user.name || "", phone: user.phone || "" });
    }
  }, [user]);

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfileService(editForm);
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    setIsSubmitting(true);
    try {
      await changePasswordService({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success("Password changed successfully!");
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto w-full">
          <Toaster position="top-right" />
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black sm:text-3xl">My Profile</h1>
              <p className="mt-1.5 text-xs font-medium text-zinc-400">
                View your registered account details and verification status.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-zinc-100 bg-white shadow-sm">
              <div className="text-sm font-medium text-zinc-400">Loading your profile...</div>
            </div>
          ) : !profileData ? (
            <div className="rounded-2xl border border-zinc-100 bg-white p-8 text-center shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#101D2D]">No Profile Data Found</h3>
              <p className="mt-1 text-sm text-zinc-500">You haven't submitted your KYC details yet.</p>
              <button
                onClick={() => window.location.href = '/onboarding'}
                className="mt-6 rounded-xl bg-[#FF6B2B] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#E55F23] transition-colors"
              >
                Complete KYC
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column: Summary Card */}
              <div className="lg:col-span-1 space-y-6">
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    {profileData.status === 'approved' ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">Verified</span>
                    ) : profileData.status === 'rejected' ? (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700">Rejected</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">Pending</span>
                    )}
                  </div>

                  <div className="flex flex-col items-center text-center mt-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 text-[#101D2D] font-black text-3xl shadow-sm mb-4">
                      {profileData.type === 'business'
                        ? (profileData.businessName?.charAt(0) || "B")
                        : (profileData.firstName?.charAt(0) || "U")}
                    </div>
                    <h2 className="text-lg font-black text-[#101D2D]">
                      {profileData.type === 'business' ? profileData.businessName : `${profileData.firstName} ${profileData.lastName}`}
                    </h2>
                    <p className="text-xs font-medium text-zinc-500 mt-1 capitalize">{profileData.type} Account</p>
                    <p className="text-xs font-medium text-zinc-400 mt-1">{profileData.email}</p>
                  </div>
                </div>

                {profileData.status === 'rejected' && profileData.rejectionReason && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-900 mb-2">Rejection Reason</h4>
                    <p className="text-xs font-medium text-red-800">{profileData.rejectionReason}</p>
                    <button
                      onClick={() => window.location.href = '/onboarding'}
                      className="mt-4 w-full rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition-colors"
                    >
                      Update Details
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Detailed Info */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Profile Details */}
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-[#101D2D] mb-6">Profile Details</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Full Name</span>
                      <span className="block text-sm font-semibold text-[#101D2D]">{user?.name || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Account Role</span>
                      <span className="block text-sm font-semibold text-[#101D2D] capitalize">{user?.role || "User"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Email Address</span>
                      <span className="block text-sm font-semibold text-[#101D2D]">{user?.email || "N/A"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Phone Number</span>
                      <span className="block text-sm font-semibold text-[#101D2D]">{user?.phone || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* KYC Details */}
                <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-[#101D2D] mb-6">KYC Verification Details</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Registered Email</span>
                      <span className="block text-sm font-semibold text-[#101D2D]">{profileData.email}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Registered Phone</span>
                      <span className="block text-sm font-semibold text-[#101D2D]">{profileData.phoneNumber}</span>
                    </div>

                    {profileData.type === 'business' ? (
                      <>
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Registration Number (RC)</span>
                          <span className="block text-sm font-semibold text-[#101D2D]">{profileData.registrationNumber || "N/A"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Tax Identification Number (TIN)</span>
                          <span className="block text-sm font-semibold text-[#101D2D]">{profileData.taxIdentificationNumber || "N/A"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Industry</span>
                          <span className="block text-sm font-semibold text-[#101D2D]">{profileData.industryCategory?.name || profileData.industry || "N/A"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Business Type</span>
                          <span className="block text-sm font-semibold text-[#101D2D]">{profileData.businessType || "N/A"}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Registered Address</span>
                          <span className="block text-sm font-semibold text-[#101D2D]">{profileData.registeredAddress || "N/A"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Contact Person Name</span>
                          <span className="block text-sm font-semibold text-[#101D2D]">{profileData.contactPersonName || "N/A"}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">ID Type</span>
                          <span className="block text-sm font-semibold text-[#101D2D]">{profileData.idType?.toUpperCase() || "N/A"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">ID Number</span>
                          <span className="block text-sm font-semibold text-[#101D2D]">{profileData.idNumber || "N/A"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Date of Birth</span>
                          <span className="block text-sm font-semibold text-[#101D2D]">
                            {profileData.dob || profileData.dateOfBirth ? new Date(profileData.dob || profileData.dateOfBirth).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Nationality</span>
                          <span className="block text-sm font-semibold text-[#101D2D]">{profileData.nationality || "N/A"}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Residential Address</span>
                          <span className="block text-sm font-semibold text-[#101D2D]">{profileData.residentialAddress || "N/A"}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Profile Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-[#101D2D]">Edit Basic Info</h3>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <form onSubmit={handleEditProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm font-semibold outline-none focus:border-[#FF6B2B]/60 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm font-semibold outline-none focus:border-[#FF6B2B]/60 focus:bg-white"
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="w-1/2 rounded-xl border border-zinc-200 py-3 text-xs font-bold text-zinc-600 hover:bg-zinc-50">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="w-1/2 rounded-xl bg-[#FF6B2B] py-3 text-xs font-bold text-white shadow-md hover:bg-[#E55F23] disabled:opacity-50">
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Change Password Modal */}
          {isPasswordModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-[#101D2D]">Change Password</h3>
                  <button onClick={() => setIsPasswordModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm font-semibold outline-none focus:border-[#FF6B2B]/60 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm font-semibold outline-none focus:border-[#FF6B2B]/60 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-sm font-semibold outline-none focus:border-[#FF6B2B]/60 focus:bg-white"
                    />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="w-1/2 rounded-xl border border-zinc-200 py-3 text-xs font-bold text-zinc-600 hover:bg-zinc-50">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="w-1/2 rounded-xl bg-zinc-900 py-3 text-xs font-bold text-white shadow-md hover:bg-zinc-800 disabled:opacity-50">
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
    </div>
  );
}
