export interface ApiResponse {
  message: string;
  data?: any;
}

export interface messagePayload {
  sessionId: string;
  content: string;
}


export interface EscalationPayload {
  sessionId: string;
  name: string;
  email: string;
  message: string;
}