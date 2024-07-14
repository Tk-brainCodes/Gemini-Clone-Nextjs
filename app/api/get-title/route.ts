import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { createShortTitlePrompts } from "@/lib/langchain";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const { prompts } = await req.json();

    if (!prompts || !Array.isArray(prompts)) {
      return res.status(400).json({ error: "Invalid prompts array" });
    }

    const titles = await createShortTitlePrompts(prompts);

    return NextResponse.json({ titles });
  } catch (error) {
    console.log("error generating title", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
