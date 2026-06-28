import api from "../lib/axios";

export const analyzeCompliance = async (question?: string): Promise<{ success: boolean; analysis?: string; message?: string }> => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const response = await api.post("/assistant/analyze", { question }, {
      headers: {
        Authorization: token && token !== 'undefined' && token !== 'null' ? `Bearer ${token}` : ''
      }
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while analyzing compliance."
    };
  }
};
