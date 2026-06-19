import api from "@/src/lib/axios";

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role?: string;
}

export const registerUser = async (data: RegisterPayload) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
