import SidebarDrawer from "@/components/sidebar/sidebar";
import AITextGenerator from "@/components/main/main";

import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();

  return (
    <main className='flex flex-row'>
      <SidebarDrawer />
      <AITextGenerator user={user?.id} />
    </main>
  );
}
