import {
  ApiResponse,
  escalationForms,
  EscalationPayload,
  messagePayload,
} from "../types";
import { apiClient } from "./apiClient";

export const chatService = {
  sendChat: async (messagePayload: messagePayload): Promise<any> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/chat",
        messagePayload
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export const escalateService = {
  sendEscalationForm: async (formData: EscalationPayload): Promise<any> => {
    try {
      const response = await apiClient.post<ApiResponse>(
        "/escalation",
        formData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getAllEscalation: async (): Promise<ApiResponse<escalationForms>> => {
    try {
      const response = await apiClient.get<ApiResponse<escalationForms>>(
        "/escalation"
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getEscaltionBySessionId: async (sessionId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.get<ApiResponse>(
        `/escalation/${sessionId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};
