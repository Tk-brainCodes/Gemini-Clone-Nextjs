import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// const createShortTitlePrompt = async (texts: string[]): Promise<string[]> => {
//   return texts.map(
//     (text) => `
//     Please provide a short and concise title for the following text:
    
//     Text: "${text}"
    
//     Title:
//   `
//   );
// };

// export const createDynamicTitle = async (
//   prompts: string[]
// ): Promise<string[]> => {
//   const model = new ChatGoogleGenerativeAI({
//     apiKey: `${process.env.GOOGLE_API_KEY}`,
//     temperature: 0.7,
//     model: "gemini-1.5-pro-latest",
//     maxOutputTokens: 100,
//     topK: 64,
//     topP: 0.95,
//     safetySettings: [
//       {
//         category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//         threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
//       },
//     ],
//   });

//   const responses = await Promise.all(
//     prompts.map(async (prompt) => {
//       const res = await model.invoke([["human", `${prompt}`]]);

//       if (Array.isArray(res)) {
//         return res
//           .map((r) => r.content)
//           .join(" ")
//           .trim();
//       }

//       return (res.content as string).trim();
//     })
//   );

//   return responses;
// };

export const createDynamicPromptInput = async (prompt: string) => {
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
};
