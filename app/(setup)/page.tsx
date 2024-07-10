"use client"

import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";


const SetupPage =  () => {
    const { userId } = useAuth();

  if (userId) {
    return redirect("/new-chat");
  }

return redirect("/sign-in")
};

export default SetupPage;
