import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const SetupPage = async () => {
  const profile = await initialProfile();

  const chatMessage = await db.chat.findFirst({
    where: {
      messages: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  if (chatMessage) {
    redirect(`/server/${chatMessage.id}`);
  }

  return redirect("/new-chat");
};

export default SetupPage;
