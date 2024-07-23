import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Message } from "@/types/conversation-types";
import axios from "axios";

export const sendUserPropmtToAI = createAsyncThunk<
  Message,
  { prompt: string; isEdited?: boolean; messageId?: string },
  { rejectValue: string; state: RootState }
>(
  "conversation/sendUserPropmtToAI",
  async ({ prompt, isEdited, messageId }, { rejectWithValue, getState }) => {
    const state = getState() as RootState;

    // Check if there is a current session
    const currentSession = state.conversation.sessions.find(
      (session) => session.id === state.conversation.currentSessionId
    );

    if (!currentSession) {
      return rejectWithValue("No current session");
    }

    let fullPrompt: string;

    if (isEdited && messageId) {
      // Replace the old message with the new one
      const messageIndex = currentSession.messages.findIndex(
        (m) => m.id === messageId
      );
      if (messageIndex !== -1) {
        const updatedMessages = [...currentSession.messages];
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          text: prompt,
        };
        fullPrompt = updatedMessages
          .map((message) => `${message.sender}: ${message.text}`)
          .join("\n");
      } else {
        return rejectWithValue("Message not found");
      }
    } else {
      // For new messages, append the new prompt to the existing conversation
      fullPrompt =
        currentSession.messages
          .map((message) => `${message.sender}: ${message.text}`)
          .join("\n") + `\nuser: ${prompt}`;
    }

    try {
      const response = await axios.post<{ data: string }>("/api/generate", {
        prompt: fullPrompt,
      });
      return {
        id: messageId || "newMessageId",
        sender: "ai",
        text: response.data.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data as string);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchChatsSession = createAsyncThunk(
  "conversation/fetchChatsSession",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/chat");
      return response.data;
    } catch (error) {
      console.log("something went wrong :", error);
      return rejectWithValue("Failed to fetch chats sessions");
    }
  }
);

export const saveChatSession = createAsyncThunk(
  "conversation/saveChatSession",
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

export const updateMessage = createAsyncThunk<
  void,
  { sessionId: string; messageId: string; text: string },
  { rejectValue: string; state: RootState }
>(
  "conversation/updateMessage",
  async ({ sessionId, messageId, text }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const session = state.conversation.sessions.find(
      (session) => session.id === sessionId
    );

    if (session) {
      const messageIndex = session.messages.findIndex(
        (message) => message.id === messageId
      );

      if (messageIndex !== -1) {
        // Update the message
        const updatedMessages = [...session.messages];
        updatedMessages[messageIndex] = {
          ...updatedMessages[messageIndex],
          text,
        };

        // Generate new AI response
        await dispatch(
          sendUserPropmtToAI({ prompt: text, isEdited: true, messageId })
        );
        await dispatch(saveChatSession());
      }
    }
  }
);
