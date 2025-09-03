import { ApiResponse, messagePayload } from "../types";
import { apiClient } from "./apiClient";

export const chatService = {
  sendChat: async (messagePayload: messagePayload): Promise<any> => {
    try {
      const response = await apiClient.post<ApiResponse>("/chat", messagePayload);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
