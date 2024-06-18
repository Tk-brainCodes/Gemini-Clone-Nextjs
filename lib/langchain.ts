import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// This imports the mechanism that helps create the messages
// called `prompts` we send to the LLM
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.7,
  model: "gemini-1.5-pro-latest",
  maxOutputTokens: 8192,
  topK: 64,
  topP: 0.95,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});

const createDynamicPromptInput = async (promptInput: string) => {
  const res = await model.invoke([["human", `${promptInput}`]]);

  return res;
};

export default createDynamicPromptInput;
