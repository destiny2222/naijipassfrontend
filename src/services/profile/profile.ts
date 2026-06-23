import api from "@/src/lib/axios";

export const updateProfileService = async (data: { name: string; phone: string }) => {
  try {
    const response = await api.put("/profile/me", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePasswordService = async (data: { currentPassword: string; newPassword: string }) => {
  try {
    const response = await api.put("/profile/password", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
