import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";

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

export const createShortTitlePrompts = async (prompts: string[]) => {
  const results = [];

  const examples = [
    {
      input:
        "in a tabular format, give me the difference between rust and javascript",
      output: "Rust vs. Javascript",
    },
    {
      input:
        "write a code to Create a recipe for a low-carb meal with the following ingredients I have in my fridge: cauliflower, and cucumber in react",
      output: "React Recipe Display",
    },
    {
      input: "give me the history of algeria",
      output: "A Brief History of Algeria",
    },
  ];

  const examplePrompt = ChatPromptTemplate.fromTemplate(`Human: {input}
{output}`);
  const fewShotPrompt = new FewShotChatMessagePromptTemplate({
    prefix:
      "Produce a short and concise title description, following the examples given",
    suffix: "Human: {input}",
    examplePrompt,
    examples,
    inputVariables: ["input"],
  });

  for (const prompt of prompts) {
    const formattedPrompt = await fewShotPrompt.format({
      input: prompt,
    });

    const responses = await model.invoke(formattedPrompt);
    results.push(responses.content);
  }

  return results;
};

export const createDynamicPromptInput = async (prompt: string) => {
  const res = await model.invoke([["human", `${prompt}`]]);
  return res.content;
};
