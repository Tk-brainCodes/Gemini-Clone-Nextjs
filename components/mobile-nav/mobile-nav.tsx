"use client";

import { useEffect, useCallback, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ActionTooltip from "@/components/action-tooltip";
import { assets } from "@/assets";
import { useRouter, usePathname } from "next/navigation";
import {
  setCurrentSession,
  selectCurrentSession,
} from "@/redux/conversationSlice";
import { selectSessions, isOpen } from "@/redux/conversationSlice";
import { fetchChatsSession } from "@/redux/conversationThunk";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import axios from "axios";
import useDarkMode from "@/hooks/toggle-theme";
import Switch from "@mui/material/Switch";
import Image from "next/image";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MobileNav = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(selectSessions);
  const open = useAppSelector(isOpen);
  const currentSessionPathId = pathname.split("/").pop();
  const { darkMode, handleSetDarkMode, handleSetLightMode } = useDarkMode();
  const [loadingDelete, setDeleteLoading] = useState(false);
  const currentSession = useAppSelector(selectCurrentSession);

  const handleSessionClick = useCallback(
    (id: string) => {
      dispatch(setCurrentSession(id));
      router.push(`/chat/${id}`);
    },
    [router, dispatch]
  );

  const memoizedFetchSession = useCallback(() => {
    dispatch(fetchChatsSession());
  }, [dispatch]);

  useEffect(() => {
    if (!loadingDelete) {
      memoizedFetchSession();
    }
    memoizedFetchSession();
  }, [memoizedFetchSession, loadingDelete]);

  const handleToggleTheme = () => {
    if (darkMode) {
      handleSetLightMode();
    } else {
      handleSetDarkMode();
    }
  };

  const handleDeleteChatSessions = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete(`/api/delete-chat/${currentSession?.id}`);
      toast("Chat Deleted Successfully");
      router.push("/new-chat");
    } catch (error) {
      console.log("[DELETE_ERROR]", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        className='bg-[#f0f4f9] h-[100vh] rounded-r-lg

 dark:bg-[#1e1f20] border-none'
        side='left'
      >
        <div className='flex items-center justify-between flex-col h-full'>
          <div className='w-full'>
            <>
              <li className='text-[14px] dark:text-white list-none font-semibold leading-[20px] text-[#1f1f1f] mt-6'>
                {sessions?.length > 0 && "Recent"}
              </li>
              <ul className='h-[188px] w-full overflow-x-hidden overflow-y-auto'>
                {sessions
                  .map((session: any) => (
                    <>
                      <ActionTooltip
                        key={session.id}
                        side='right'
                        align='center'
                        label={
                          session.messages.length > 0 &&
                          session.messages[0].sender === "user"
                            ? session.messages[0].text
                            : ""
                        }
                      >
                        <li
                          className={cn(
                            "relative w-full dark:text-white text-[14px] gap-[10px] flex items-center justify-between list-none group font-normal p-2 pl-4 py-2 rounded-[30px] leading-[20px] text-[#444746] mt-2 cursor-pointer",
                            currentSessionPathId === session.id
                              ? "text-[#041e49] dark:text-[#c2e7ff] dark:bg-[#004a77] bg-[#d3e3fd]"
                              : "hover:bg-[#E9EEF6] dark:hover:bg-[#444746]"
                          )}
                        >
                          <span
                            onClick={() => handleSessionClick(session.id)}
                            className='flex items-center gap-x-4 justify-center w-full'
                          >
                            <assets.ChatBubbleIcon
                              className='cursor-pointer duration-500 fill-[#1f1f1f] w-[16px] h-[16px] mt-1 dark:fill-white'
                              width={24}
                              height={24}
                            />
                            <p className='flex-1 text-[16px] font-normal truncate'>
                              {session.messages.length > 0 &&
                              session.messages[0].sender === "user"
                                ? session.messages[0].text
                                : null}
                            </p>
                          </span>
                        </li>
                      </ActionTooltip>
                    </>
                  ))
                  .filter((session: any) => session.length !== null)}
              </ul>
            </>
          </div>

          <ul className='pt-6 w-full'>
            <div className='w-full'>
              <ActionTooltip side='right' align='center' label='Help'>
                <li
                  className={cn(
                    "flex rounded-[20px] p-2 dark:hover:bg-[#444746] cursor-pointer hover:bg-light-white text-[#444746]  text-sm items-center w-full font-semibold  gap-x-4 hover:bg-slate-200"
                  )}
                >
                  <assets.HelpIcon
                    width={24}
                    height={24}
                    className='cursor-pointer duration-500 fill-[#1f1f1f] dark:fill-white'
                  />
                  <span
                    className={`leading-[20px] dark:text-white text-[14px] ${
                      !open && "hidden"
                    } origin-left duration-200`}
                  >
                    Help
                  </span>
                </li>
              </ActionTooltip>
              <ActionTooltip
                side='right'
                align='center'
                label='Gemini Apps Activity'
              >
                <li
                  className={cn(
                    "flex rounded-[20px] p-2 dark:hover:bg-[#444746] cursor-pointer hover:bg-light-white text-[#444746]  text-sm items-center w-full font-semibold  gap-x-4 hover:bg-slate-200"
                  )}
                >
                  <assets.HistoryIcon
                    width={24}
                    height={24}
                    className='cursor-pointer duration-500 fill-[#1f1f1f] dark:fill-white'
                  />
                  <span
                    className={`leading-[20px] dark:text-white text-[14px] ${
                      !open && "hidden"
                    } origin-left duration-200`}
                  >
                    Activity
                  </span>
                </li>
              </ActionTooltip>
              <DropdownMenu>
                <ActionTooltip side='right' align='center' label='Settings'>
                  <DropdownMenuTrigger
                    className={cn(
                      "flex p-2 cursor-pointer dark:hover:bg-[#444746] hover:bg-light-white text-[#444746]  text-sm items-center font-semibold w-full gap-x-4 hover:bg-slate-200 rounded-[20px]"
                    )}
                  >
                    <assets.SettingsIcon
                      width={24}
                      height={24}
                      className='cursor-pointer duration-500 fill-[#1f1f1f] dark:fill-white'
                    />
                    <span
                      className={`leading-[20px] dark:text-white text-[14px] ${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      Settings
                    </span>
                  </DropdownMenuTrigger>
                </ActionTooltip>
                <DropdownMenuContent
                  side='right'
                  className='bg-[#e9eef6] dark:bg-[#444746]  border-none px-2 py-2 w-[267px] shadow-2xl flex flex-col items-center justify-center gap-x-3 rounded-md'
                >
                  <DropdownMenuItem className='w-full flex itms-center justify-start gap-x-3  mt-2 hover:bg-[#37393]'>
                    <assets.ExtensionsIcon
                      width={24}
                      height={24}
                      className='w-[24px] cursor-pointer duration-500 fill-[#1f1f1f] dark:fill-white'
                    />
                    <span className='dark:text-white text-[#1f1f1f]'>
                      Extensions
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='w-full flex items-center justify-start gap-x-3 hover:bg-[#37393]'>
                    <assets.LinkIcon
                      width={24}
                      height={24}
                      className='w-[24px] cursor-pointer duration-500 fill-[#1f1f1f] dark:fill-white'
                    />
                    <span className='dark:text-white text-[#1f1f1f]'>
                      Your public link
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className='w-full flex items-center -mt-2 justify-between  hover:bg-[#37393]'>
                    <div className='flex itms-start justify-center gap-x-3 '>
                      <assets.ThemeModeIcon
                        width={24}
                        height={24}
                        className='w-[24px] cursor-pointer duration-500 fill-[#1f1f1f] dark:fill-white'
                      />
                      <span className=' dark:text-white text-[#1f1f1f]'>
                        Dark theme
                      </span>
                    </div>
                    <Switch
                      defaultChecked
                      checked={darkMode}
                      onChange={handleToggleTheme}
                    />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* <Button className='bg-[#dde3ea] mt-[20px] dark:bg-[#37393b] max-sm:hidden max-md:hidden dark:text-white text-[#000000] font-normal flex gap-x-3 rounded-[10px] hover:bg-[#c0c3c6]'>
              <Image
                src={assets.gemini_sparkle}
                alt='gemini_sparkel'
                width={24}
                height={24}
              />
              Try Gemini Advanced
            </Button> */}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
