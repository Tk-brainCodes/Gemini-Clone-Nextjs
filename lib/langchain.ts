import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import {
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
  apiKey: `${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
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

// export const createShortTitlePrompts = async (prompts: string[]) => {
//   const results = [];

//   const examples = [
//     {
//       input:
//         "in a tabular format, give me the difference between rust and javascript",
//       output: "Rust vs. Javascript",
//     },
//     {
//       input:
//         "write a code to Create a recipe for a low-carb meal with the following ingredients I have in my fridge: cauliflower, and cucumber in react",
//       output: "React Recipe Display",
//     },
//     {
//       input: "give me the history of algeria",
//       output: "A Brief History of Algeria",
//     },
//   ];

//   const examplePrompt = ChatPromptTemplate.fromTemplate(`Human: {input}
// {output}`);
//   const fewShotPrompt = new FewShotChatMessagePromptTemplate({
//     prefix:
//       "Produce a short and concise title description, following the examples given",
//     suffix: "Human: {input}",
//     examplePrompt,
//     examples,
//     inputVariables: ["input"],
//   });

//   for (const prompt of prompts) {
//     const formattedPrompt = await fewShotPrompt.format({
//       input: prompt,
//     });

//     const responses = await model.invoke(formattedPrompt);
//     results.push(responses.content);
//   }

//   return results;
// };

export const generateGoogleSearch = async (text: string) => {
  const examples = [
    {
      input: "write test for the code.",
      output: "How do i test my react application?",
    },
    {
      input:
        "Briefly summarize this concept: urban planning. Include a brief description of the term and list key aspects of the concept.",
      output: "Urban planning concept",
    },
    {
      input:
        "write a code to Create a recipe for a low-carb meal with the following ingredients I have in my fridge: cauliflower, and cucumber in react",
      output: "Is cucumber good for low carb diet?",
    },
  ];

  const examplePrompt = ChatPromptTemplate.fromTemplate(
    `Human: {input}{output}`
  );
  const fewShotPrompt = new FewShotChatMessagePromptTemplate({
    prefix:
      " Generate bewtween 1 and 10 important related google search title. Make it sound more human. Do not add any extra text and do not number them, only return the google search questions. Do not include the provided examples in the result",
    suffix: "Human: {input}",
    examplePrompt,
    examples,
    inputVariables: ["input"],
  });

  const formattedPrompt = await fewShotPrompt.format({
    input: text,
  });

  const response = await model.invoke(formattedPrompt);
  const responseText = response.content as string;

  return responseText;
};

export const createDynamicPromptInput = async (prompt: string) => {
  try {
    const res = await model.invoke([["human", `${prompt}`]]);
    return res.content;
  } catch (error) {
    console.log("something went wrong:", error);
  }
};
