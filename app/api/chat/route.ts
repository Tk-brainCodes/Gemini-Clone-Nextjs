import { NextApiRequest } from "next";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";

export async function POST(req: Request, res: NextResponse) {
  const { sessions } = await req.json();
  const profile = await currentProfile();

  if (!Array.isArray(sessions)) {
    return new NextResponse("Invalid session data", { status: 400 });
  }

  if (!profile?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const chatResponse = await Promise.all(
      sessions.map(async (session: any) => {
        const chatSession = await db.chat.findUnique({
          where: { id: session.id, profileId: profile?.id },
        });

        if (chatSession) {
          await db.chat.update({
            where: { id: session.id },
            data: {
              profile: { connect: { id: profile?.id! } },
              messages: {
                deleteMany: {},
                create: session.messages.map((message: any) => ({
                  sender: message.sender,
                  text: message.text,
                  profileId: profile?.id!,
                })),
              },
            },
          });
        } else {
          await db.chat.create({
            data: {
              id: session.id,
              profile: { connect: { id: profile?.id! } },
              messages: {
                create: session.messages.map((message: any) => ({
                  sender: message.sender,
                  text: message.text,
                  profileId: profile?.id!,
                })),
              },
            },
          });
        }
      })
    );

    return NextResponse.json(chatResponse);
  } catch (error) {
    console.log("error", error);
    return new NextResponse("Failed to save message", { status: 500 });
  }
}

export async function GET(req: NextApiRequest, res: NextResponse) {
  const profile = await currentProfile();

  if (!profile) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const chats = await db.chat.findMany({
      where: { profileId: profile.id },
      include: { messages: true },
    });

    return NextResponse.json(chats);
  } catch (error) {
    return new NextResponse("Failed to get messages", { status: 500 });
  }
}
