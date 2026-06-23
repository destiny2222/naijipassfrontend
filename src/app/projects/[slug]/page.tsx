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
        <main className="flex-grow flex items-center justify-center">
          <div className="text-zinc-500 font-medium animate-pulse">Loading tender details...</div>
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
        
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B2B]">
                Tender Details
              </span>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                {bid.bidNumber}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-zinc-100 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#101D2D]">{bid.title}</h2>
                  </div>
                  <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusColor(bid.status)}`}>
                    {bid.status || "Unknown"}
                  </span>
                </div>
                
                <div className="prose prose-sm max-w-none text-zinc-600">
                  <h3 className="text-sm font-bold text-[#101D2D] uppercase tracking-wider mb-3 border-b border-zinc-100 pb-2">Description</h3>
                  <p className="whitespace-pre-wrap leading-relaxed">{bid.description || "No description provided."}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-100 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-sm font-bold text-[#101D2D] uppercase tracking-wider mb-5 border-b border-zinc-100 pb-3">Procurement Entities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Issuing Agency</div>
                    <div className="font-medium text-[#101D2D] text-sm">{bid.agency}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Procuring Entity</div>
                    <div className="font-medium text-[#101D2D] text-sm">{bid.procuringEntity || "Same as Issuing Agency"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-[#101D2D] uppercase tracking-wider mb-5 border-b border-zinc-100 pb-3">Key Information</h3>
                
                <div className="space-y-5">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Deadline</div>
                    <div className={`font-medium text-sm ${isPastDeadline ? "text-rose-600 font-bold" : "text-[#101D2D]"}`}>
                      {new Date(bid.deadline).toLocaleString(undefined, {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Sector</div>
                    <div className="font-medium text-sm text-[#101D2D]">{bid.sector || "N/A"}</div>
                  </div>
                  
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Location</div>
                    <div className="font-medium text-sm text-[#101D2D]">{bid.location || "N/A"}</div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-100">
                  {!user ? (
                    <>
                      <Link 
                        href="/login"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B2B] px-5 py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#E55F23] hover:-translate-y-0.5 transition-all"
                      >
                        Login to Apply
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                      <p className="text-center mt-3 text-[10px] text-zinc-400">
                        You must be a registered contractor to bid on this tender.
                      </p>
                    </>
                  ) : bid.createdById === user.id ? (
                    <>
                      <button 
                        disabled
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-5 py-3.5 text-xs font-bold text-zinc-400 cursor-not-allowed"
                      >
                        Cannot Apply
                      </button>
                      <p className="text-center mt-3 text-[10px] text-zinc-400">
                        You are the creator of this bid.
                      </p>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsApplyModalOpen(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B2B] px-5 py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#E55F23] hover:-translate-y-0.5 transition-all"
                      >
                        Apply for this Bid
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <p className="text-center mt-3 text-[10px] text-zinc-400">
                        Submit your technical and financial proposal for this tender.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 mt-12">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-zinc-100">
            <h2 className="text-2xl font-black mb-6">Reviews</h2>

            <div className="space-y-6 mb-10">
              {reviews.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">No reviews yet. Be the first to leave a review!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-zinc-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 bg-zinc-100 rounded-full flex items-center justify-center font-bold text-zinc-500 uppercase">
                        {review.user?.name?.substring(0, 2) || "U"}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#101D2D]">{review.user?.name || "Unknown User"}</div>
                        <div className="flex gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-zinc-200 fill-current"}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-zinc-400 ml-auto">{new Date(review.createdAt).toLocaleDateString()}</div>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed mt-3">{review.comment}</p>
                  </div>
                ))
              )}
            </div>

            {user ? (
              <div className="bg-zinc-50/50 rounded-2xl p-6 border border-zinc-100">
                <h3 className="font-bold mb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className={`focus:outline-none ${reviewForm.rating >= star ? 'text-amber-400' : 'text-zinc-300'} hover:text-amber-500 transition-colors`}
                        >
                          <svg className="h-8 w-8 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Comment</label>
                    <textarea
                      required
                      rows={4}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-[#101D2D] outline-none transition-all placeholder:text-zinc-400 focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/10 resize-none"
                      placeholder="Share your thoughts about this bid..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="self-start rounded-xl bg-[#101D2D] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-black disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#101D2D]">Log in to write a review</h3>
                  <p className="text-xs text-zinc-500 mt-1">Join the community to share your feedback.</p>
                </div>
                <Link href="/login" className="rounded-xl bg-[#101D2D] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-black transition-colors">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#101D2D]/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#101D2D]">Submit Application</h3>
                <p className="text-[11px] text-zinc-400 mt-1">Provide your proposal details</p>
              </div>
              <button 
                onClick={() => setIsApplyModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleApplySubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Proposal / Cover Letter <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={6}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-[#101D2D] outline-none transition-all placeholder:text-zinc-400 focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/10 resize-none"
                  placeholder="Explain why you are a good fit for this bid..."
                  value={applyFormData.proposalText}
                  onChange={(e) => setApplyFormData({ ...applyFormData, proposalText: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Proposed Amount (₦) <span className="text-zinc-400 lowercase font-normal">(Optional)</span></label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-[#101D2D] outline-none transition-all placeholder:text-zinc-400 focus:border-[#FF6B2B] focus:ring-4 focus:ring-[#FF6B2B]/10"
                  placeholder="e.g. 500000"
                  value={applyFormData.proposedAmount}
                  onChange={(e) => setApplyFormData({ ...applyFormData, proposedAmount: e.target.value })}
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="flex-1 rounded-xl bg-zinc-100 px-4 py-3 text-xs font-bold text-[#101D2D] hover:bg-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex justify-center items-center gap-2 rounded-xl bg-[#FF6B2B] px-4 py-3 text-xs font-bold text-white shadow-md shadow-[#FF6B2B]/20 hover:bg-[#E55F23] disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
