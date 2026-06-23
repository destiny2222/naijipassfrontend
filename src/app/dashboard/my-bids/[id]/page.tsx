"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/src/components/sidebar/page";
import TopNav from "@/src/components/tobnav/page";
import { useAuth } from "@/src/hooks/useAuth";
import { getBidDetails, Bid, updateBid, getBidCategories, BidCategory } from "@/src/services/bids/bids";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function BidDetailsPage() {
  const [bid, setBid] = useState < Bid | null > (null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState < BidCategory[] > ([]);
  const [formData, setFormData] = useState({
    title: "", bidNumber: "", deadline: "", agency: "", procuringEntity: "", sector: "", location: "", description: "", status: "published", categoryId: ""
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (params.id) {
          const response = await getBidDetails(params.id as string);
          if (response.success && response.data) {
            setBid(response.data);
          } else {
            toast.error("Failed to load bid details.");
            router.push("/dashboard/my-bids");
          }
        }
      } catch (error) {
        console.error("Failed to fetch bid details", error);
        toast.error("An error occurred while fetching bid details.");
        router.push("/dashboard/my-bids");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();

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
  }, [params.id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bid || !formData.title || !formData.bidNumber || !formData.deadline || !formData.agency || !formData.categoryId || !formData.procuringEntity || !formData.sector || !formData.location || !formData.description || !formData.status) {
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

      const res = await updateBid(bid.id, payload);
      if (res.success) {
        toast.success("Bid updated successfully!");
        setIsEditing(false);
        // Refresh bid details
        const detailsRes = await getBidDetails(bid.id);
        if (detailsRes.success && detailsRes.data) {
          setBid(detailsRes.data);
        }
      } else {
        toast.error(res.message || "Failed to update bid.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred while updating.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50/50 flex items-center justify-center">
        <div className="text-zinc-500 font-medium animate-pulse">Loading bid details...</div>
      </div>
    );
  }

  if (!bid) return null;

  const isPastDeadline = new Date(bid.deadline) < new Date();
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
    <div className="min-h-screen bg-zinc-50/50 text-[#101D2D]">
      {/* Sidebar Layout */}
      <Sidebar activeItem="My Bids" />

      {/* Main Viewport panel */}
      <div className="lg:pl-64 flex flex-col min-h-screen">

        {/* TopNav */}
        <TopNav userName={user?.name || "Contractor"} userRole={user?.role || "User"} />

        {/* Dashboard Area */}
        <main className="flex-grow p-6 sm:p-8">

          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-zinc-200 text-zinc-600 hover:text-[#FF6B2B] hover:border-[#FF6B2B]/30 transition-all"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-black sm:text-3xl">
                Bid Details
              </h1>
              <p className="mt-1 text-xs font-medium text-zinc-400">
                Viewing full information for {bid.bidNumber}
              </p>
            </div>
          </div>

          <div className="mb-6 flex justify-end">
            <button
              onClick={() => {
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
                setIsEditing(true);
              }}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#FF6B2B] px-5 text-xs font-bold text-white shadow-md hover:bg-[#E55F23] hover:-translate-y-0.5 transition-all"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit this Bid
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#101D2D]">{bid.title}</h2>
                    <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">{bid.bidNumber}</div>
                  </div>
                  <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusColor(bid.status)}`}>
                    {bid.status || "Unknown"}
                  </span>
                </div>

                <div className="prose prose-sm max-w-none text-zinc-600">
                  <h3 className="text-sm font-bold text-[#101D2D] uppercase tracking-wider mb-2 border-b border-zinc-100 pb-2">Description</h3>
                  <p className="whitespace-pre-wrap">{bid.description || "No description provided."}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#101D2D] uppercase tracking-wider mb-4 border-b border-zinc-100 pb-3">Procurement Entities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Issuing Agency</div>
                    <div className="font-medium text-[#101D2D]">{bid.agency}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Procuring Entity</div>
                    <div className="font-medium text-[#101D2D]">{bid.procuringEntity || "Same as Issuing Agency"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#101D2D] uppercase tracking-wider mb-4 border-b border-zinc-100 pb-3">Key Information</h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Deadline</div>
                    <div className={`font-medium ${isPastDeadline ? "text-rose-600" : "text-[#101D2D]"}`}>
                      {new Date(bid.deadline).toLocaleString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Sector</div>
                    <div className="font-medium text-[#101D2D]">{bid.sector || "N/A"}</div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Location</div>
                    <div className="font-medium text-[#101D2D]">{bid.location || "N/A"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Bid Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
              <h2 className="text-lg font-bold text-[#101D2D]">Edit Bid Details</h2>
              <button onClick={() => setIsEditing(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
              <div className="space-y-4">
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
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#101D2D] py-3 text-sm font-bold text-white shadow-md hover:bg-opacity-95 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? "Updating..." : "Update Bid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

