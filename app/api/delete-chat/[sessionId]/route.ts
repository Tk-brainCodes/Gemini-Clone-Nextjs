import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
 
  if (!params.sessionId) {
    return new NextResponse("Session ID is required", { status: 400 });
  }

  try {
    const profile = await db.profile.findUnique({
      where: { userId: userId },
    });

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    await db.message.deleteMany({
      where: {
        chatId: params.sessionId,
        profileId: profile.id,
      },
    });

    const deletedChat = await db.chat.deleteMany({
      where: {
        id: params.sessionId,
        profileId: profile.id,
      },
    });

    if (deletedChat.count === 0) {
      return new NextResponse(
        "Chat session not found or not authorized to delete",
        { status: 404 }
      );
    }

    return new NextResponse("Chat session deleted successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    return new NextResponse("Failed to delete chat session", { status: 500 });
  }
}
