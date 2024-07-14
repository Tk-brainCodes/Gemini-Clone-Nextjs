import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import type { RootState } from "./store";
import { ConversationState } from "@/types/conversation-types";
import { sendUserPropmtToAI, fetchChatsSession } from "./conversationThunk";

const initialState: ConversationState = {
  sessions: [],
  currentSessionId: "",
  status: "idle",
  error: null,
  showResult: false,
  open: false,
};

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
