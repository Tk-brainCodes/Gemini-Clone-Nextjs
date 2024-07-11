export interface Message {
  sender: "user" | "ai";
  text: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
}

export interface ConversationState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  showResult: boolean;
  open: boolean;
}
