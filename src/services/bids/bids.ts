import api from "@/src/lib/axios";

export interface BidCategory {
  id: number;
  name: string;
}

export interface Bid {
  id: string;
  title: string;
  slug?: string;
  bidNumber: string;
  deadline: string;
  agency: string;
  procuringEntity: string;
  sector: string;
  location: string;
  description: string;
  status: string;
  categoryId: number;
  createdById?: string;
  userId?: string;
}

export interface CreateBidPayload {
  title: string;
  bidNumber: string;
  deadline: string;
  agency: string;
  procuringEntity: string;
  sector: string;
  location: string;
  description: string;
  status: string;
  categoryId: number;
}

export interface UpdateBidPayload {
  title?: string;
  bidNumber?: string;
  deadline?: string;
  agency?: string;
  procuringEntity?: string;
  sector?: string;
  location?: string;
  description?: string;
  status?: string;
  categoryId?: number | null;
}

export const getBidCategories = async (): Promise<{ success: boolean; data: BidCategory[] }> => {
  try {
    const response = await api.get("/bids/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addBidCategory = async (data: { name: string }): Promise<any> => {
  try {
    const response = await api.post("/bids/categories", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBid = async (data: CreateBidPayload): Promise<any> => {
  try {
    const response = await api.post("/bids", data);
     
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBid = async (id: string, data: UpdateBidPayload): Promise<any> => {
  try {
    const response = await api.put(`/bids/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patchBid = async (id: string, data: UpdateBidPayload): Promise<any> => {
  try {
    const response = await api.patch(`/bids/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBids = async (params?: { categoryId?: number; status?: string; search?: string }): Promise<{ success: boolean; data: Bid[] }> => {
  try {
    const response = await api.get("/bids", { params }); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBidDetails = async (id: string): Promise<{ success: boolean; data: Bid }> => {
  try {
    const response = await api.get(`/bids/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const applyToBid = async (id: string, data: { proposalText: string; proposedAmount: string }): Promise<any> => {
  try {
    const response = await api.post(`/bids/${id}/apply`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface BidReview {
  id: string;
  bidId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
  } | null;
}

export const getBidReviews = async (id: string): Promise<{ success: boolean; data: BidReview[] }> => {
  try {
    const response = await api.get(`/bids/${id}/reviews`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addBidReview = async (id: string, data: { rating: number; comment: string }): Promise<any> => {
  try {
    const response = await api.post(`/bids/${id}/reviews`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
