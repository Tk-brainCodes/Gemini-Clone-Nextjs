import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import type { RootState } from "./store";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatSession {
  id: string;
  messages: Message[];
}

interface ConversationState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  showResult: boolean;
}

const initialState: ConversationState = {
  sessions: [],
  currentSessionId: null,
  status: "idle",
  error: null,
  showResult: false,
};

export const fetchGeneratedText = createAsyncThunk<
  Message,
  { prompt: string },
  { rejectValue: string; state: RootState }
>(
  "conversation/fetchGeneratedText",
  async ({ prompt }, { rejectWithValue, getState }) => {
    const state = getState();

    //check if there is a current session
    const currentSession = state.conversation.sessions.find(
      (session) => session.id === state.conversation.currentSessionId
    );

    if (!currentSession) {
      return rejectWithValue("No current session");
    }

    const fullPrompt =
      currentSession.messages
        .map((message) => `${message.sender}: ${message.text}`)
        .join("\n") + `\nuser: ${prompt}`;

    try {
      const response = await axios.post<{ data: string }>("/api/generate", {
        prompt: fullPrompt,
      });
      return { sender: "ai", text: response.data.data };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as string);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    startNewSession(state) {
      const newSessionId = uuidv4();
      state.sessions.push({ id: newSessionId, messages: [] });
      state.currentSessionId = newSessionId;
    },
    setCurrentSession(state, action: PayloadAction<string>) {
      state.currentSessionId = action.payload;
    },
    addUserMessage(
      state,
      action: PayloadAction<{ sessionId: string; text: string }>
    ) {
      const session = state.sessions.find(
        (s) => s.id === action.payload.sessionId
      );
      if (session) {
        session.messages.push({ sender: "user", text: action.payload.text });
      }
    },
    setShowResult(state, action: PayloadAction<boolean>) {
      state.showResult = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneratedText.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGeneratedText.fulfilled, (state, action) => {
        state.status = "succeeded";
        const session = state.sessions.find(
          (s) => s.id === state.currentSessionId
        );
        if (session) {
          session.messages.push(action.payload);
        }
      })
      .addCase(fetchGeneratedText.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const {
  startNewSession,
  setCurrentSession,
  addUserMessage,
  setShowResult,
} = conversationSlice.actions;



export const selectSessions = (state: RootState) => state.conversation.sessions;
export const selectCurrentSession = (state: RootState) =>
  state.conversation.sessions.find(
    (s) => s.id === state.conversation.currentSessionId
  );
export const selectStatus = (state: RootState) => state.conversation.status;
export const selectError = (state: RootState) => state.conversation.error;
export const showResult = (state: RootState) => state.conversation.showResult;
export const selectCurrentSessionId = (state: RootState) =>
  state.conversation.currentSessionId;

export default conversationSlice.reducer;
