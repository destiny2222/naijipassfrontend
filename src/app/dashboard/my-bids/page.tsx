"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/src/components/sidebar/page";
import TopNav from "@/src/components/tobnav/page";
import { useAuth } from "@/src/hooks/useAuth";
import { getBids, Bid, getBidCategories, BidCategory, createBid, updateBid } from "@/src/services/bids/bids";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function MyBidsPage() {
  const [bids, setBids] = useState < Bid[] > ([]);
  const { user } = useAuth();
  const [fetchingBids, setFetchingBids] = useState(false);
  const [modalMode, setModalMode] = useState < 'create' | 'edit' | 'view' | null > (null);
  const [selectedBid, setSelectedBid] = useState < Bid | null > (null);
  const [categories, setCategories] = useState < BidCategory[] > ([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    bidNumber: "",
    deadline: "",
    agency: "",
    procuringEntity: "",
    sector: "",
    location: "",
    description: "",
    status: "published",
    categoryId: ""
  });

  const fetchBids = async () => {
    setFetchingBids(true);
    try {
      const response = await getBids(); // Fetch all bids
      if (response.success && response.data) {
        const userBids = user ? response.data.filter((b: any) => b.createdById === user.id) : [];
        setBids(userBids);
      }
    } catch (error) {
      console.error("Failed to fetch bids", error);
    } finally {
      setFetchingBids(false);
    }
  };

  useEffect(() => {
    fetchBids();

    const fetchCategories = async () => {
      try {
        const response = await getBidCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.bidNumber || !formData.deadline || !formData.agency || !formData.categoryId || !formData.procuringEntity || !formData.sector || !formData.location || !formData.description || !formData.status) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        bidNumber: formData.bidNumber,
        deadline: new Date(formData.deadline).toISOString(),
        agency: formData.agency,
        procuringEntity: formData.procuringEntity,
        sector: formData.sector,
        location: formData.location,
        description: formData.description,
        status: formData.status,
        categoryId: parseInt(formData.categoryId)
      };

      if (modalMode === 'edit' && selectedBid) {
        const res = await updateBid(selectedBid.id, payload);
        if (res.success) {
          toast.success("Bid updated successfully!");
          setModalMode(null);
          fetchBids();
        } else {
          toast.error(res.message || "Failed to update bid.");
        }
      } else {
        const res = await createBid(payload);
        if (res.success) {
          toast.success("Bid submitted successfully!");
          setModalMode(null);
          setFormData({ title: "", bidNumber: "", deadline: "", agency: "", procuringEntity: "", sector: "", location: "", description: "", status: "published", categoryId: "" });
          fetchBids();
        } else {
          toast.error(res.message || "Failed to submit bid.");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred while submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusiness = user?.kyc?.details?.type === 'business' || (user as any)?.kyc?.type === 'business';

  return (
    <div className="min-h-screen bg-zinc-50/50 text-[#101D2D]">
      {/* Sidebar Layout */}
      <Sidebar activeItem="My Bids" />

      {/* Main Viewport panel */}
      <div className="lg:pl-64 flex flex-col min-h-screen">

        {/* TopNav */}
        <TopNav userName={user?.name || "Contractor"} userRole={user?.role || "User"} />

        {/* Dashboard Area */}
        <main className="flex-grow p-6 sm:p-8">

          {/* Header text */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black sm:text-3xl">My Bids</h1>
              <p className="mt-1.5 text-xs font-medium text-zinc-400">
                Track your active submissions, contract awards, and bidding history.
              </p>
            </div>

            <button
              onClick={() => {
                setFormData({ title: "", bidNumber: "", deadline: "", agency: "", procuringEntity: "", sector: "", location: "", description: "", status: "published", categoryId: "" });
                setSelectedBid(null);
                setModalMode('create');
              }}
              className="flex items-center gap-2 rounded-xl bg-[#FF6B2B] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#E55F23] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Submit New Bid
            </button>
          </div>

          {/* Bids List */}
          <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600">
                <thead className="bg-zinc-50/50 text-xs font-bold uppercase text-zinc-400 border-b border-zinc-100">
                  <tr>
                    <th scope="col" className="px-6 py-4">Bid Details</th>
                    <th scope="col" className="px-6 py-4">Agency / Procuring Entity</th>
                    <th scope="col" className="px-6 py-4">Sector & Location</th>
                    <th scope="col" className="px-6 py-4">Deadline</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {fetchingBids ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm font-medium text-zinc-400">
                        Loading your bids...
                      </td>
                    </tr>
                  ) : bids.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm font-medium text-zinc-400">
                        You have not submitted any bids yet.
                      </td>
                    </tr>
                  ) : bids.map((bid) => {
                    const getStatusColor = (status: string) => {
                      switch (status?.toLowerCase()) {
                        case 'active':
                        case 'published':
                          return 'bg-emerald-50 text-emerald-700';
                        case 'draft':
                          return 'bg-zinc-100 text-zinc-600';
                        case 'closed':
                          return 'bg-rose-50 text-rose-700';
                        default:
                          return 'bg-amber-50 text-amber-700';
                      }
                    };

                    return (
                      <tr key={bid.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#101D2D]">{bid.title}</div>
                          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{bid.bidNumber}</div>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">
                          <div className="text-[#101D2D]">{bid.agency}</div>
                          {bid.procuringEntity && bid.procuringEntity !== bid.agency && (
                            <div className="text-[10px] text-zinc-500 mt-0.5">{bid.procuringEntity}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">
                          <div className="text-[#101D2D]">{bid.sector || "N/A"}</div>
                          {bid.location && (
                            <div className="text-[10px] text-zinc-500 mt-0.5">{bid.location}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">
                          {new Date(bid.deadline).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusColor(bid.status)}`}>
                            {bid.status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-3">
                          <Link
                            href={`/dashboard/my-bids/${bid.id}`}
                            className="text-xs font-bold text-[#101D2D] hover:text-[#FF6B2B]"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedBid(bid);
                              let formattedDeadline = "";
                              if (bid.deadline) {
                                const date = new Date(bid.deadline);
                                formattedDeadline = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                              }
                              setFormData({
                                title: bid.title || "",
                                bidNumber: bid.bidNumber || "",
                                deadline: formattedDeadline,
                                agency: bid.agency || "",
                                procuringEntity: bid.procuringEntity || "",
                                sector: bid.sector || "",
                                location: bid.location || "",
                                description: bid.description || "",
                                status: bid.status || "published",
                                categoryId: bid.categoryId ? bid.categoryId.toString() : ""
                              });
                              setModalMode('edit');
                            }}
                            className="text-xs font-bold text-[#FF6B2B] hover:text-[#E55F23]"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Submit Bid Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
              <h2 className="text-lg font-bold text-[#101D2D]">
                {modalMode === 'create' ? 'Submit New Bid' : modalMode === 'edit' ? 'Edit Bid' : 'Bid Details'}
              </h2>
              <button onClick={() => setModalMode(null)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
              <fieldset disabled={modalMode === 'view'} className="space-y-4">
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Project Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#FF6B2B] focus:bg-white focus:ring-2 focus:ring-[#FF6B2B]/20"
                    placeholder="e.g. Dualization of Lagos-Ibadan Expressway"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Bid Number / Reference</label>
                  <input
                    type="text"
                    name="bidNumber"
                    value={formData.bidNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#FF6B2B] focus:bg-white focus:ring-2 focus:ring-[#FF6B2B]/20"
                    placeholder="e.g. BID-2026-FMWH-0089"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Issuing Agency</label>
                  <input
                    type="text"
                    name="agency"
                    value={formData.agency}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#FF6B2B] focus:bg-white focus:ring-2 focus:ring-[#FF6B2B]/20"
                    placeholder="e.g. Federal Ministry of Works"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Procuring Entity</label>
                  <input
                    type="text"
                    name="procuringEntity"
                    value={formData.procuringEntity}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#FF6B2B] focus:bg-white focus:ring-2 focus:ring-[#FF6B2B]/20"
                    placeholder="e.g. Federal Ministry of Works & Housing"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Sector</label>
                  <input
                    type="text"
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#FF6B2B] focus:bg-white focus:ring-2 focus:ring-[#FF6B2B]/20"
                    placeholder="e.g. Infrastructure"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#FF6B2B] focus:bg-white focus:ring-2 focus:ring-[#FF6B2B]/20"
                    placeholder="e.g. Ibadan North LGA, Oyo State"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#FF6B2B] focus:bg-white focus:ring-2 focus:ring-[#FF6B2B]/20 min-h-[100px]"
                    placeholder="Brief description of the procurement..."
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#FF6B2B] focus:bg-white focus:ring-2 focus:ring-[#FF6B2B]/20"
                    required
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#FF6B2B] focus:bg-white focus:ring-2 focus:ring-[#FF6B2B]/20"
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">Submission Deadline</label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#FF6B2B] focus:bg-white focus:ring-2 focus:ring-[#FF6B2B]/20"
                    required
                  />
                </div>
              </fieldset>

              <div className="mt-8">
                {modalMode !== 'view' ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-[#101D2D] py-3 text-sm font-bold text-white shadow-md hover:bg-opacity-95 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? "Submitting..." : modalMode === 'edit' ? "Update Bid" : "Confirm & Submit Bid"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setModalMode('edit')}
                    className="w-full rounded-xl bg-[#FF6B2B] py-3 text-sm font-bold text-white shadow-md hover:bg-[#E55F23] hover:-translate-y-0.5 transition-all"
                  >
                    Edit this Bid
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
