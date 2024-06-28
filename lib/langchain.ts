import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

async function createDynamicPromptInput(prompt: string) {
  const model = new ChatGoogleGenerativeAI({
    apiKey: `${process.env.GOOGLE_API_KEY}`,
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

  const res = await model.invoke([["human", `${prompt}`]]);
  return res.content;
}

export default createDynamicPromptInput;
