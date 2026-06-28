"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { getBids, getBidReviews, Bid, BidReview } from "@/src/services/bids/bids";

// We'll calculate SentimentData dynamically from reviews
interface SentimentData {
  rating: string;
  totalFeedback: string;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  topics: string[];
}

export default function ReviewPage() {
  const { user } = useAuth();
  
  const [bids, setBids] = useState<Bid[]>([]);
  const [selectedBidId, setSelectedBidId] = useState<string>("");
  const [reviews, setReviews] = useState<BidReview[]>([]);
  
  const [loadingBids, setLoadingBids] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Load all bids on mount
  useEffect(() => {
    // Wait until user is loaded to fetch their specific bids
    if (!user) return;

    const fetchBids = async () => {
      try {
        setLoadingBids(true);
        const res = await getBids();
        if (res.success && res.data) {
          // Filter to only show projects listed/created by the logged-in user
          const userBids = res.data.filter(bid => bid.userId === user.id || bid.createdById === user.id);
          
          setBids(userBids);
          if (userBids.length > 0) {
            setSelectedBidId(userBids[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoadingBids(false);
      }
    };
    fetchBids();
  }, [user]);

  // Load reviews when selected bid changes
  useEffect(() => {
    if (!selectedBidId) return;
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const res = await getBidReviews(selectedBidId);
        if (res.success && res.data) {
          // Sort by newest first
          const sorted = [...res.data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setReviews(sorted);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [selectedBidId]);

  const selectedBid = useMemo(() => bids.find(b => b.id === selectedBidId), [bids, selectedBidId]);

  // Calculate sentiment dynamically based on reviews
  const sentiment = useMemo<SentimentData>(() => {
    if (!reviews || reviews.length === 0) {
      return {
        rating: "0.0",
        totalFeedback: "0",
        positivePct: 0,
        neutralPct: 0,
        negativePct: 0,
        topics: ["No data yet"]
      };
    }
    
    let totalScore = 0;
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;

    reviews.forEach(review => {
      totalScore += review.rating;
      if (review.rating >= 4) positiveCount++;
      else if (review.rating === 3) neutralCount++;
      else negativeCount++;
    });

    const total = reviews.length;
    return {
      rating: (totalScore / total).toFixed(1),
      totalFeedback: total.toLocaleString(),
      positivePct: Math.round((positiveCount / total) * 100),
      neutralPct: Math.round((neutralCount / total) * 100),
      negativePct: Math.round((negativeCount / total) * 100),
      // Dummy topics for now since they are hard to extract without NLP
      topics: ["Traffic Management", "Pothole Repairs", "Night Lighting"]
    };
  }, [reviews]);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 1) return `${days} days ago`;
    if (days === 1) return `Yesterday`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} mins ago`;
    return `Just now`;
  };

  const getStatusNodeColors = (rating: number) => {
    if (rating >= 4) return { border: "border-[#C84B24]", bg: "bg-[#FFF1EB]", text: "text-[#C84B24]" };
    if (rating === 3) return { border: "border-zinc-400", bg: "bg-zinc-50", text: "text-zinc-600" };
    return { border: "border-[#D34141]", bg: "bg-red-50", text: "text-red-600" };
  };

  if (loadingBids) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#101D2D]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-[1200px] mx-auto w-full min-h-screen">
      
      {/* Header Section */}
      {selectedBid && (
        <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-4 uppercase tracking-wider">
              <Link href="/projects" className="hover:text-[#101D2D] transition-colors">Projects</Link>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              <span className="hover:text-[#101D2D] transition-colors cursor-pointer">{selectedBid.sector || 'General'}</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              <span className="text-[#FF6B2B]">{selectedBid.bidNumber}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-[#101D2D] tracking-tight mb-3 leading-tight">
              {selectedBid.title}
            </h1>
            <p className="text-sm md:text-base text-zinc-500 font-medium max-w-2xl leading-relaxed">
              {selectedBid.description?.substring(0, 150) || "Project feedback and reviews tracking."}...
            </p>
          </div>

          {/* Status Badge */}
          <div className="shrink-0 flex items-center gap-2 bg-[#EAF2FF] border border-[#D1E3FF] rounded-2xl px-5 py-3 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B2B] shadow-[0_0_8px_rgba(255,107,43,0.6)] animate-pulse" />
            <span className="font-black text-sm text-[#101D2D] uppercase tracking-wide">
              {selectedBid.status.replace(" ", "\n")}
            </span>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Track Segment Component (Project Selector) */}
          <div className="bg-[#FFF9F5] border border-[#FFE8D6] rounded-[24px] p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-black text-[#101D2D] mb-5">Select a Project to View Feedback</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select
                  value={selectedBidId}
                  onChange={(e) => setSelectedBidId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-sm font-medium text-[#101D2D] outline-none focus:border-[#101D2D] focus:ring-1 focus:ring-[#101D2D] transition-all shadow-sm appearance-none"
                >
                  <option value="" disabled>Select a project...</option>
                  {bids.map(bid => (
                    <option key={bid.id} value={bid.id}>
                      {bid.bidNumber} - {bid.title}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-zinc-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* User Reviews (formerly Live Field Reports) */}
          <div className="bg-white border border-zinc-100 rounded-[24px] shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-zinc-50 flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#101D2D]">User Reviews</h2>
              <div className="bg-[#FFF1EB] text-[#FF6B2B] p-2.5 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {loadingReviews ? (
                <div className="py-12 flex justify-center text-zinc-400">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 italic">No reviews found for this project.</div>
              ) : (
                reviews.map((review, index) => {
                  const isLast = index === reviews.length - 1;
                  const colors = getStatusNodeColors(review.rating);
                  return (
                    <div key={review.id} className={`relative pl-8 ${!isLast ? "pb-10" : ""}`}>
                      {/* Vertical Line */}
                      {!isLast && <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-zinc-100" />}
                      
                      {/* Timeline Node */}
                      <div className={`absolute left-[3px] top-2 w-[18px] h-[18px] bg-white border-2 ${colors.border} rounded-full z-10 ${index === 0 ? "left-0 top-1.5 w-[24px] h-[24px] border-[3px]" : ""}`} />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h3 className="text-base font-bold text-[#101D2D]">{review.user?.name || "Anonymous User"}</h3>
                        <span className="text-xs font-semibold text-zinc-500">{timeAgo(review.createdAt)}</span>
                      </div>
                      
                      <div className={`pl-5 border-l-[3px] ${colors.border} pt-1 ${index === 0 ? "-ml-[23px]" : "-ml-[20px]"}`}>
                        <div className="bg-white rounded-xl border border-zinc-100 p-5 shadow-sm">
                          <p className="text-sm text-[#101D2D] leading-relaxed mb-4 font-medium">
                            {review.comment}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 text-zinc-600 px-2.5 py-1 rounded-md text-[11px] font-bold">
                              <div className="flex gap-0.5 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-zinc-200 fill-current"}`} viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </span>
                            <span className={`inline-flex items-center ${colors.bg} ${colors.text} px-2.5 py-1 rounded-md text-[11px] font-bold`}>
                              {review.rating >= 4 ? "Positive" : review.rating === 3 ? "Neutral" : "Needs Improvement"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {reviews.length > 0 && (
                <div className="mt-8">
                  <button className="w-full py-3.5 bg-transparent hover:bg-orange-50 border border-[#FFE8D6] rounded-xl text-sm font-bold text-[#4B3B33] transition-colors">
                    Load Older Reviews
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          <div className="bg-[#FFFDFB] border border-[#F3EBE3] rounded-[24px] p-6 shadow-sm">
            <h2 className="text-2xl font-black text-[#101D2D] mb-6">Citizen Sentiment</h2>
            
            <div className="flex items-start gap-4 mb-8">
              <div className="text-[64px] font-black text-[#101D2D] leading-none tracking-tighter">{sentiment.rating}</div>
              <div className="pt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-5 h-5 ${star <= parseFloat(sentiment.rating) ? 'text-[#C84B24] fill-current' : 'text-zinc-200 fill-current'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-[11px] font-semibold text-zinc-500 leading-tight">
                  out of 5 based on<br />{sentiment.totalFeedback} feedbacks
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-xs font-semibold">
                <div className="w-16 text-zinc-600">Positive</div>
                <div className="flex-1 h-2.5 bg-[#D6E6FF] rounded-full overflow-hidden flex">
                  <div className="bg-[#C84B24] h-full rounded-full transition-all duration-500" style={{ width: `${sentiment.positivePct}%` }} />
                </div>
                <div className="w-8 text-right text-[#101D2D]">{sentiment.positivePct}%</div>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <div className="w-16 text-zinc-600">Neutral</div>
                <div className="flex-1 h-2.5 bg-[#D6E6FF] rounded-full overflow-hidden flex">
                  <div className="bg-[#59667A] h-full rounded-full transition-all duration-500" style={{ width: `${sentiment.neutralPct}%` }} />
                </div>
                <div className="w-8 text-right text-[#101D2D]">{sentiment.neutralPct}%</div>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <div className="w-16 text-zinc-600">Negative</div>
                <div className="flex-1 h-2.5 bg-[#D6E6FF] rounded-full overflow-hidden flex">
                  <div className="bg-[#D34141] h-full rounded-full transition-all duration-500" style={{ width: `${sentiment.negativePct}%` }} />
                </div>
                <div className="w-8 text-right text-[#101D2D]">{sentiment.negativePct}%</div>
              </div>
            </div>

            <hr className="border-t border-[#F3EBE3] my-6" />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-[#101D2D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="text-sm font-black text-[#101D2D]">Top Discussed Topics</h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {sentiment.topics.map((topic, i) => (
                  <span key={i} className="px-4 py-2 bg-[#F3F6FA] border border-[#E1E8F2] text-[#24354F] text-xs font-bold rounded-xl shadow-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Project Details Card */}
          {selectedBid && (
            <div className="bg-gradient-to-br from-[#1E2333] to-[#161A26] rounded-[24px] p-6 sm:p-8 shadow-sm text-white">
              <h2 className="text-2xl font-black mb-6">Project Details</h2>
              
              <div className="space-y-5">
                <div>
                  <div className="text-[11px] font-semibold text-zinc-400 mb-1">Contractor / Agency</div>
                  <div className="text-base font-bold text-white">{selectedBid.agency || "Julius Berger Nig. PLC"}</div>
                </div>
                
                <div>
                  <div className="text-[11px] font-semibold text-zinc-400 mb-1">Supervising Entity</div>
                  <div className="text-base font-bold text-white">{selectedBid.procuringEntity || "Fed. Ministry of Works"}</div>
                </div>
                
                <div className="border-t border-white/10 my-4 pt-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] font-semibold text-zinc-400 mb-1">Location</div>
                    <div className="text-sm font-black text-white">{selectedBid.location || "Lagos, Nigeria"}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-zinc-400 mb-1">Deadline</div>
                    <div className="text-sm font-bold text-white">{new Date(selectedBid.deadline).toLocaleDateString() || "Dec 2024"}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
