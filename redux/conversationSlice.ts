import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./store";

interface ConversationState {
  prompt: string;
  generatedText: string;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ConversationState = {
  prompt: "",
  generatedText: "",
  status: "idle",
};

//fetch generated text
export const fetchGeneratedText = createAsyncThunk(
  "conversation/fetchGeneratedText",
  async ({ userId, prompt }: { userId: string; prompt: string }) => {
    const response = await axios.post("/api/generate", { userId, prompt });
    return response.data.response;
  }
);

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setPrompt(state, action: PayloadAction<string>) {
      state.prompt = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeneratedText.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGeneratedText.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.generatedText = action.payload;
      })
      .addCase(fetchGeneratedText.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setPrompt } = conversationSlice.actions;

export const selectPrompt = (state: RootState) => state.conversation.prompt;
export const selectGeneratedText = (state: RootState) =>
  state.conversation.generatedText;
export const selectStatus = (state: RootState) => state.conversation.status;

export default conversationSlice.reducer;
