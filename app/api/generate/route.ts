import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import createDynamicPromptInput from "@/lib/langchain";

export async function POST(req: Request, res: NextApiResponse) {
  const { prompt: userPrompt } = await req.json();

  try {
    const response = await createDynamicPromptInput(userPrompt);

    console.log("Generated response from route handler:", response); 

    return NextResponse.json({data: response});
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
