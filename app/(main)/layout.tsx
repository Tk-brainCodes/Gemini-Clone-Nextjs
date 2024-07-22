"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectStatus, setOpen } from "@/redux/conversationSlice";
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
import SidebarDrawer from "@/components/sidebar/sidebar";
import PromptInput from "@/components/prompt-input/prompt-input";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const status = useAppSelector(selectStatus);
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    dispatch(setOpen());
  };

  return (
    <main className='flex flex-row'>
      <SidebarDrawer />
      <div className='w-full bg-white dark:bg-[#131314] h-screen pb-[15vh] relative overflow-x-hidden'>
        <div className='sticky z-10 top-0 bg-white flex flex-col dark:bg-[#131314] h-[90px] px-4 py-2  right-0 w-full'>
          <nav className='flex items-center justify-between w-full mt-4'>
            <DropdownMenu>
              <DropdownMenuTrigger className='text-[20px] leading-[28px] text-[#5f6368] flex items-center justify-center gap-x-2'>
                <span className='dark:text-white flex gap-x-4 items-center'>
                  <ActionTooltip
                    side='bottom'
                    align='center'
                    label='Expand menu'
                  >
                    <Button
                      onClick={handleToggle}
                      className='bg-0 dark:hover:bg-[#282a2c]  hidden max-sm:flex max-md:flex hover:bg-0 px-2 py-2 w-[50px] h-[50px] items-center justify-center rounded-full  cursor-pointer'
                    >
                      <assets.MenuIcon
                        className='cursor-pointer duration-500 fill-[#3c4043] dark:fill-white'
                        width={24}
                        height={24}
                      />
                    </Button>
                  </ActionTooltip>
                  Gemini
                </span>
                <assets.ArrowDropdownIcon
                  width={24}
                  height={24}
                  className='fill-[#1f1f1f] dark:fill-white'
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-[#f0f4f9] dark:bg-[#1e1f20] border-none'>
                <DropdownMenuItem className='dark:text-white'>
                  Gemini
                </DropdownMenuItem>
                <DropdownMenuItem className='dark:text-white'>
                  Gemini Advanced
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className='flex gap-x-4'>
              <Button className='bg-[#dde3ea] dark:bg-[#37393b] max-sm:hidden max-md:hidden dark:text-white text-[#000000] font-normal flex gap-x-3 rounded-[10px] hover:bg-[#c0c3c6]'>
                <Image
                  src={assets.gemini_sparkle}
                  alt='gemini_sparkel'
                  width={24}
                  height={24}
                />
                Try Gemini Advanced
              </Button>
              <ActionTooltip align='center' side='bottom' label='Google apps'>
                <Button className='w-[40px] h-[40px] max-sm:hidden max-md:hidden bg-none hover:bg-slate-400 rounded-full dark:hover:bg-[#37393b] px-2 py-2 flex items-center justify-center'>
                  <assets.GoogleAppsIcon
                    className='fill-[#1f1f1f] dark:fill-white'
                    width={24}
                    height={24}
                  />
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
          {pathname === "/new-chat" && status === "loading" ? (
            <div className='loading_bar mt-[2.6em]'>
              <div></div>
            </div>
          ) : (
            ""
          )}
        </div>
        <section className='flex flex-col items-center justify-start px-8'>
          {children}
          <PromptInput />
        </section>
      </div>
    </main>
  );
};

export default MainLayout;
