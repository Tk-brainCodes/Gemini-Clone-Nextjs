import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Message } from "@/types/conversation-types";
import axios from "axios";

//send prompt to langchain api route and save response in conversation session
export const sendUserPropmtToAI = createAsyncThunk<
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
