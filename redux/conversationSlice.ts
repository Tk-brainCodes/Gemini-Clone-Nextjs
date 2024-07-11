import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import type { RootState } from "./store";
import { ConversationState } from "@/types/conversation-types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Message } from "@/types/conversation-types";
import axios from "axios";

const initialState: ConversationState = {
  sessions: [],
  currentSessionId: "",
  status: "idle",
  error: null,
  showResult: false,
  open: false,
};

export const sendUserPropmtToAI = createAsyncThunk<
  Message,
  { prompt: string },
  { rejectValue: string; state: RootState }
>(
  "conversation/sendUserPropmtToAI",
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

//get the saved chat session from the db
export const fetchChatsSession = createAsyncThunk(
  "conversation/fetchSessions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/chat");
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch chats sessions");
    }
  }
);

//save chat sessions to the db
export const saveChatSession = createAsyncThunk(
  "conversation/saveSessions",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const sessions = state.conversation.sessions;
    try {
      await axios.post("/api/chat", { sessions });
    } catch (error) {
      return rejectWithValue("Failed to save chat");
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
    setOpen(state) {
      state.open = !state.open;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendUserPropmtToAI.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(sendUserPropmtToAI.fulfilled, (state, action) => {
        state.status = "succeeded";
        const session = state.sessions.find(
          (s) => s.id === state.currentSessionId
        );
        if (session) {
          session.messages.push(action.payload);
        }
      })
      .addCase(sendUserPropmtToAI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchChatsSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sessions = action.payload;
      })
      .addCase(fetchChatsSession.rejected, (state, action) => {
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
  setOpen,
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

export const isOpen = (state: RootState) => state.conversation.open;

export default conversationSlice.reducer;
