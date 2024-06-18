import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import createDynamicPromptInput from "@/lib/langchain";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { userId, prompt: userPrompt } = req.body;

  try {
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const response = await createDynamicPromptInput(userPrompt);

    return NextResponse.json(response);
  } catch (error) {
    return new NextResponse("GENERATE_CHAT_FAIL", { status: 500 });
  }
}
