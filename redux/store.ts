import { configureStore } from "@reduxjs/toolkit";
import conversationSlice from "./conversationSlice";

export const store = configureStore({
  reducer: {
    conversation: conversationSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
