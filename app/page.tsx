import SidebarDrawer from "@/components/sidebar/sidebar";
import AITextGenerator from "@/components/main/main";


export default async function Home() {

  return (
    <main className='flex flex-row'>
      <SidebarDrawer />
      <AITextGenerator />
    </main>
  );
}
