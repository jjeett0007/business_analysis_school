export interface ApiResponse {
  message: string;
  data?: any;
}

export interface messagePayload {
  sessionId: string;
  content: string;
}
