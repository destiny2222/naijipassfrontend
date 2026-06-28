"use client";

import { useEffect, useState } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Breadcrumb from "@/src/components/Breadcrumb";
import { getBidDetails, Bid, applyToBid, getBidReviews, addBidReview, BidReview } from "@/src/services/bids/bids";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { ArrowLeft, Calendar, MapPin, BarChart3, Building2, Star, Send } from "lucide-react";

export default function PublicBidDetailsPage() {
  const [bid, setBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const isBusiness = user?.kyc?.details?.type === 'business' || (user as any)?.kyc?.type === 'business';

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyFormData, setApplyFormData] = useState({ proposalText: "", proposedAmount: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bid) return;
    
    setIsSubmitting(true);
    try {
      const response = await applyToBid(bid.id, applyFormData);
      if (response.success) {
        toast.success("Successfully applied to bid!");
        setIsApplyModalOpen(false);
        setApplyFormData({ proposalText: "", proposedAmount: "" });
      } else {
        toast.error(response.message || "Failed to apply");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [reviews, setReviews] = useState<BidReview[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bid || !user) return;
    
    if (reviewForm.rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    
    setIsSubmittingReview(true);
    try {
      const response = await addBidReview(bid.id, reviewForm);
      if (response.success) {
        toast.success("Review submitted successfully!");
        setReviewForm({ rating: 0, comment: "" });
        // Fetch reviews again
        const reviewsRes = await getBidReviews(bid.id);
        if (reviewsRes.success) setReviews(reviewsRes.data);
      } else {
        toast.error(response.message || "Failed to submit review");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (params.slug) {
          const response = await getBidDetails(params.slug as string);
          if (response.success && response.data) {
            setBid(response.data);
          } else {
            toast.error("Failed to load bid details.");
            router.push("/projects");
          }
        }
      } catch (error) {
        console.error("Failed to fetch bid details", error);
        toast.error("An error occurred while fetching bid details.");
        router.push("/projects");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [params.slug, router]);

  useEffect(() => {
    if (bid?.id) {
      const loadReviews = async () => {
        try {
          const res = await getBidReviews(bid.id);
          if (res.success) {
            setReviews(res.data);
          }
        } catch (error) {
          console.error("Failed to fetch reviews", error);
        }
      };
      loadReviews();
    }
  }, [bid?.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50/50">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0088FF] mb-4"></div>
          <div className="text-zinc-500 font-bold text-sm animate-pulse">Loading tender details...</div>
        </main>
        <Footer />
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
    <div className="flex min-h-screen flex-col bg-zinc-50/50 text-[#101D2D]">
      <Navbar />

      <main className="flex-grow">
        <Breadcrumb />
        
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center gap-5">
            <button 
              onClick={() => router.back()}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-zinc-200 text-zinc-500 hover:text-[#0088FF] hover:border-[#0088FF]/30 hover:shadow-md transition-all group"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </button>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#0088FF]/20 bg-[#0088FF]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#0088FF] mb-2">
                Tender Overview
              </span>
              <h1 className="text-3xl font-black sm:text-4xl tracking-tight text-[#101D2D]">
                Ref: {bid.bidNumber}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Title and Description */}
              <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 sm:p-10 shadow-sm transition-all hover:shadow-lg">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                  <h2 className="text-2xl font-black text-[#101D2D] max-w-2xl leading-tight">{bid.title}</h2>
                  <span className={`inline-flex items-center rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest ${getStatusColor(bid.status)} shadow-sm`}>
                    <span className={`mr-2 h-2 w-2 rounded-full animate-pulse ${bid.status?.toLowerCase() === 'active' || bid.status?.toLowerCase() === 'published' ? 'bg-emerald-500' : 'bg-current'}`} />
                    {bid.status || "Unknown"}
                  </span>
                </div>
                
                <div className="prose prose-sm max-w-none text-zinc-600">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 border-b border-zinc-100 pb-3">Project Description</h3>
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{bid.description || "No description provided."}</p>
                </div>
              </div>

              {/* Entities Involved */}
              <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 sm:p-10 shadow-sm transition-all hover:shadow-lg">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 border-b border-zinc-100 pb-3">Procurement Entities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0088FF]/10 text-[#0088FF]">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Issuing Agency</div>
                      <div className="font-bold text-[#101D2D] text-sm">{bid.agency}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Procuring Entity</div>
                      <div className="font-bold text-[#101D2D] text-sm">{bid.procuringEntity || "Same as Issuing Agency"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              
              {/* Action Box */}
              <div className="rounded-[2rem] border border-zinc-100 bg-white p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br from-[#0088FF]/10 to-transparent blur-2xl pointer-events-none" />
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6 border-b border-zinc-100 pb-3 relative z-10">Submission</h3>
                
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isPastDeadline ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Deadline</div>
                      <div className={`font-bold text-sm ${isPastDeadline ? "text-rose-600" : "text-[#101D2D]"}`}>
                        {new Date(bid.deadline).toLocaleString(undefined, {
                          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0088FF]/10 text-[#0088FF]">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Sector</div>
                      <div className="font-bold text-sm text-[#101D2D]">{bid.sector || "General"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0088FF]/10 text-[#0088FF]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Location</div>
                      <div className="font-bold text-sm text-[#101D2D]">{bid.location || "Statewide"}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-100 relative z-10">
                  {!user ? (
                    <>
                      <Link 
                        href="/login"
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0088FF] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#0088FF]/20 hover:bg-[#0070D1] hover:-translate-y-0.5 transition-all"
                      >
                        Login to Apply
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </Link>
                      <p className="text-center mt-4 text-[11px] font-medium text-zinc-400">
                        You must be a registered contractor to bid.
                      </p>
                    </>
                  ) : bid.createdById === user.id ? (
                    <>
                      <button 
                        disabled
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-100 px-6 py-4 text-sm font-bold text-zinc-400 cursor-not-allowed"
                      >
                        Creator Cannot Apply
                      </button>
                      <p className="text-center mt-4 text-[11px] font-medium text-zinc-400">
                        You are the owner of this bid.
                      </p>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsApplyModalOpen(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0088FF] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#0088FF]/20 hover:bg-[#0070D1] hover:-translate-y-0.5 transition-all"
                      >
                        Submit Application
                        <Send className="h-4 w-4" />
                      </button>
                      <p className="text-center mt-4 text-[11px] font-medium text-zinc-400">
                        Submit your technical and financial proposal.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 mt-4">
          <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-zinc-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <h2 className="text-2xl font-black mb-8 relative z-10 flex items-center gap-3">
              <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
              Community Reviews
            </h2>            
            
            <div className="relative z-10">
              {!user ? (
                <div className="bg-zinc-50 rounded-2xl p-8 border border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-sm text-[#101D2D]">Log in to write a review</h3>
                    <p className="text-xs text-zinc-500 mt-1.5 font-medium">Join the community to share your feedback securely.</p>
                  </div>
                  <Link href="/login" className="rounded-2xl bg-[#101D2D] px-8 py-3.5 text-xs font-bold text-white shadow-md hover:bg-black transition-all hover:-translate-y-0.5 shrink-0">
                    Login
                  </Link>
                </div>
              ) : bid?.createdById === user.id ? (
                <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 text-center">
                  <p className="text-sm text-amber-700 font-bold">You cannot submit a review for your own project.</p>
                </div>
              ) : reviews.some(r => r.user?.id === user.id || (r as any).userId === user.id) ? (
                <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100 text-center flex flex-col items-center gap-2">
                  <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 fill-emerald-600" />
                  </div>
                  <p className="text-sm text-emerald-700 font-bold">You have already reviewed this project.</p>
                </div>
              ) : (
                <div className="bg-zinc-50/50 rounded-3xl p-8 border border-zinc-100 max-w-2xl">
                  <h3 className="font-black mb-6 text-[#101D2D]">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="flex flex-col gap-6">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Rate Your Experience</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className={`focus:outline-none transition-transform hover:scale-110 ${reviewForm.rating >= star ? 'text-amber-400' : 'text-zinc-200'} hover:text-amber-400`}
                          >
                            <Star className={`h-8 w-8 ${reviewForm.rating >= star ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Feedback</label>
                      <textarea
                        required
                        rows={4}
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-[#101D2D] outline-none transition-all placeholder:text-zinc-400 focus:border-[#0088FF] focus:ring-4 focus:ring-[#0088FF]/10 resize-none shadow-sm"
                        placeholder="Share your thoughts about this bid process..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="self-start rounded-2xl bg-[#101D2D] px-8 py-4 text-xs font-bold text-white shadow-md hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101D2D]/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div>
                <h3 className="text-xl font-black text-[#101D2D]">Submit Application</h3>
                <p className="text-xs font-medium text-zinc-500 mt-1">Provide your proposal details</p>
              </div>
              <button 
                onClick={() => setIsApplyModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 rounded-full transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleApplySubmit} className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5">Proposal / Cover Letter <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={6}
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-[#101D2D] outline-none transition-all placeholder:text-zinc-400 focus:border-[#0088FF] focus:ring-4 focus:ring-[#0088FF]/10 resize-none shadow-sm"
                  placeholder="Explain why your company is the perfect fit for this bid..."
                  value={applyFormData.proposalText}
                  onChange={(e) => setApplyFormData({ ...applyFormData, proposalText: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5">Proposed Amount (₦) <span className="text-zinc-400 lowercase font-normal">(Optional)</span></label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-[#101D2D] outline-none transition-all placeholder:text-zinc-400 focus:border-[#0088FF] focus:ring-4 focus:ring-[#0088FF]/10 shadow-sm"
                  placeholder="e.g. 5,000,000"
                  value={applyFormData.proposedAmount}
                  onChange={(e) => setApplyFormData({ ...applyFormData, proposedAmount: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="flex-1 rounded-2xl bg-zinc-100 px-4 py-4 text-sm font-bold text-zinc-600 hover:bg-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex justify-center items-center gap-2 rounded-2xl bg-[#0088FF] px-4 py-4 text-sm font-bold text-white shadow-lg shadow-[#0088FF]/20 hover:bg-[#0070D1] disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
