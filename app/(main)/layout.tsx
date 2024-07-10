"use client";

import SidebarDrawer from "@/components/sidebar/sidebar";
import PromptInput from "@/components/prompt-input/prompt-input";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { selectStatus } from "@/redux/conversationSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import ActionTooltip from "@/components/action-tooltip";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const status = useAppSelector(selectStatus);
  console.log("loading state", status);

  return (
    <main className='flex flex-row'>
      <SidebarDrawer />
      <div className='w-full bg-white h-screen pb-[15vh] relative overflow-x-hidden'>
        {/*App header*/}
        <div className='sticky z-10 top-0 bg-white flex flex-col h-[90px] px-4 py-2  right-0 w-full'>
          <nav className='flex items-center justify-between w-full mt-4'>
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
              <Button className='bg-[#dde3ea] text-[#000000] font-normal flex gap-x-3 rounded-[10px] hover:bg-[#c0c3c6]'>
                <Image src={assets.gemini_sparkel} alt='gemini_sparkel' />
                Try Gemini Advanced
              </Button>
              <ActionTooltip align='center' side='bottom' label='Google apps'>
                <Button className='bg-0 hover:bg-0 px-2 py-2 flex items-center justify-center'>
                  <Image src={assets.google_apps} alt='google_apps' />
                </Button>
              </ActionTooltip>

              <div className='mt-1'>
                <SignedIn>
                  <UserButton />
                </SignedIn>
                <SignedOut>
                  <SignInButton />
                </SignedOut>
              </div>
            </div>
          </nav>
          {status === "idle" && (
            <div className='loading_bar mt-[2.6em]'>
              <div></div>
            </div>
          )}
          {status === "loading" && (
            <div className='loading_bar mt-[2.6em]'>
              <div></div>
            </div>
          )}
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
