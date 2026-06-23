import api from "@/src/lib/axios";

export const getDashboardAnalytics = async (): Promise<any> => {
  try {
    const response = await api.get("/analytics");
    return response.data;
  } catch (error) {
    throw error;
  }
};
