import api from "@/src/lib/axios";

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export const verifyOtp = async (data: VerifyOtpPayload) => {
  try {
    const response = await api.post("/auth/verify-otp", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (data: ResendOtpPayload) => {
  try {
    const response = await api.post("/auth/resend-otp", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
