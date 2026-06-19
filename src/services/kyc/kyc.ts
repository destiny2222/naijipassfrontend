import api from "@/src/lib/axios";

export interface KycCategory {
  id: number;
  name: string;
}

export interface KycSubmitPayload {
  type: "business" | "individual";
  email: string;
  phoneNumber: string;
  idType: string;
  idNumber: string;
  
  // -- Individual Specific Fields --
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationality?: string;
  residentialAddress?: string;
  mailingAddress?: string;
  idDocument?: string;
  idDocumentPublicId?: string;
  proofOfAddress?: string;
  proofOfAddressPublicId?: string;

  // -- Business Specific Fields --
  businessName?: string;
  businessType?: string;
  registrationNumber?: string;
  industry?: string;
  taxIdentificationNumber?: string;
  industryCategoryId?: number;
  otherIndustryCategory?: string; // Optional field if "Other" is selected
  registeredAddress?: string;
  businessAddress?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  certificateOfIncorporation?: string;
  certificateOfIncorporationPublicId?: string;
  memorandumArticles?: string;
  memorandumArticlesPublicId?: string;
}

export interface KycRepresentative {
  name: string;
  position: string;
}

export interface KycRepresentativesPayload {
  kycId: string;
  representatives: KycRepresentative[];
}

export const getKycCategories = async (): Promise<{ data: KycCategory[] }> => {
  try {
    const response = await api.get("/kyc/categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const submitKyc = async (data: KycSubmitPayload) => {
  try {
    const response = await api.post("/kyc/submit", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface UploadDocumentResponse {
  success: boolean;
  message: string;
  url: string;
  publicId: string;
}

export const uploadDocument = async (file: File): Promise<UploadDocumentResponse> => {
  try {
    const formData = new FormData();
    formData.append("document", file);

    const response = await api.post("/uploads/document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addKycRepresentatives = async (data: KycRepresentativesPayload) => {
  try {
    const response = await api.post("/kyc/representatives", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyKycStatus = async () => {
  try {
    const response = await api.get("/kyc/my");
    return response.data;
  } catch (error) {
    throw error;
  }
};
