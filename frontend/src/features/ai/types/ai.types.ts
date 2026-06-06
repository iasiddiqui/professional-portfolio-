export interface AskIshanPayload {
  message: string;
  sessionId?: string;
}

export interface AskIshanResponse {
  id: string;
  sessionId: string;
  message: string;
  reply: string;
  model: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
