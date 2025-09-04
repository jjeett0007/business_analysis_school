export interface ApiResponse<T = unknown> {
  message: string;
  data?: any | {
    results: T[]
    pagination: {
      totalItems: number
      currentpage: number
      totalPage: number
      pageSize: number
    }
  };
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

export interface escalationForms {
  _id: string;
  sessionId: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}