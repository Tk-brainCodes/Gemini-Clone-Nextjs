import SidebarDrawer from "@/components/sidebar/sidebar";
import PromptInput from "@/components/prompt-input/prompt-input";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='flex flex-row'>
      <SidebarDrawer />
      <div className='w-full bg-white h-screen pb-[15vh] relative overflow-x-hidden'>
        {/*App header*/}
        <div className='flex items-center justify-between h-[40px] px-4 py-2 mt-5 relative right-0 w-full'>
          <DropdownMenu>
            <DropdownMenuTrigger className='text-[20px] leading-[28px] text-[#5f6368] flex items-center justify-center gap-x-2'>
              <span>Gemini</span>
              <Image src={assets.arrow_dropdown} alt='arrow_dropdown' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Gemini</DropdownMenuItem>
              <DropdownMenuItem>Gemini Advanced</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className='flex gap-x-4'>
            <Button className='bg-[#dde3ea] text-[#000000] font-normal'>
              Try Gemini Advanced
            </Button>
            <ActionTooltip align='center' side='bottom' label='Google apps'>
              <Button className='bg-0 hover:bg-0 px-2 py-2 flex items-center justify-center'>
                <Image src={assets.google_apps} alt='google_apps' />
              </Button>
            </ActionTooltip>

            <Image
              src={assets.user_icon}
              alt='user_icon'
              className='w-[40px] h-[40px] rounded-full cursor-pointer'
            />
          </div>
        </div>
            <section className='flex flex-col items-center justify-start'>

        {children}
        <PromptInput />
        </section>
      </div>
    </main>
  );
};

export default MainLayout;
