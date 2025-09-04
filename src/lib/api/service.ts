import { ApiResponse, EscalationPayload, messagePayload } from "../types";
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


export const escalateService = {
  sendEscalationForm: async (formData: EscalationPayload): Promise<any> => {
    try {
      const response = await apiClient.post<ApiResponse>("/escalation", formData);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
