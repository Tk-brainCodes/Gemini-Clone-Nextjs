"use client";

import { useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";
import { assets } from "@/assets";
import { useRouter, usePathname } from "next/navigation";
import {
  setCurrentSession,
  selectCurrentSession,
} from "@/redux/conversationSlice";
import {
  startNewSession,
  selectSessions,
  isOpen,
  setOpen,
} from "@/redux/conversationSlice";
import { fetchChatsSession } from "@/redux/conversationThunk";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import axios from "axios";
import ChatOptionsDropdown from "../dropdowns/chat-options-dropdown";
import useDarkMode from "@/hooks/toggle-theme";
import Switch from "@mui/material/Switch";

const SidebarDrawer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(selectSessions);
  const open = useAppSelector(isOpen);
  const currentSessionPathId = pathname.split("/").pop();
  const { darkMode, handleSetDarkMode, handleSetLightMode } = useDarkMode();
  const [loadingDelete, setDeleteLoading] = useState(false);
  const currentSession = useAppSelector(selectCurrentSession);

  const handleNewChat = () => {
    dispatch(startNewSession());
    router.push(`/new-chat`);
  };

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

  const handleToggle = () => {
    dispatch(setOpen());
  };

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
    <nav>
      <div
        className={` ${
          open ? "w-[292px]" : "w-20 "
        } bg-[#f0f4f9] h-[100vh] dark:bg-[#1e1f20] max-sm:hidden max-md:hidden md:hidden p-5 z-40 pt-4 top-0 left-0 duration-300 lg:flex flex-col items-start justify-between`}
      >
        <div className='flex flex-col gap-x-4 items-start justify-center'>
          <ActionTooltip side='bottom' align='center' label='Expand menu'>
            <Button
              onClick={handleToggle}
              className='bg-0 dark:hover:bg-[#282a2c] hover:bg-0 flex px-2 py-2 w-[50px] h-[50px] items-center justify-center rounded-full  cursor-pointer'
            >
              <assets.MenuIcon
                className='cursor-pointer duration-500 fill-[#3c4043] dark:fill-white'
                width={24}
                height={24}
              />
            </Button>
          </ActionTooltip>

          <div className='mt-[3em]'>
            <ActionTooltip side='bottom' align='center' label='New chat'>
              <Button
                onClick={handleNewChat}
                className={cn(
                  "flex   rounded-md p-2 cursor-pointer dark:bg-[#282a2c] hover:bg-light-white text-[#444746] bg-[#dde3ea] text-sm items-center font-semibold  gap-x-4",
                  open ? "rounded-[20px] w-[150px]" : "rounded-full"
                )}
                disabled={pathname === "/new-chat" ? true : false}
              >
                <assets.PlusIcon
                  width={24}
                  height={24}
                  className='cursor-pointer duration-500 fill-[#1f1f1f] dark:fill-white'
                />
                <span
                  className={cn(
                    "leading-[20px] dark:text-white text-[14px] origin-left duration-200",
                    !open && "hidden"
                  )}
                >
                  New chat
                </span>
              </Button>
            </ActionTooltip>
          </div>

          <div className='w-full'>
            {open && (
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
                              "relative w-[260px] dark:text-white text-[14px] gap-[10px] flex items-center justify-between list-none group font-normal p-2 pl-4 py-2 rounded-[30px] leading-[20px] text-[#444746] mt-2 cursor-pointer",
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
                            <ChatOptionsDropdown
                              loadingDelete={loadingDelete}
                              handleDelete={handleDeleteChatSessions}
                            >
                              <span
                                className={cn(
                                  "absolute right-2 w-[28px] h-[28px] hidden group-hover:flex items-center justify-center rounded-full -mt-[15px]",
                                  currentSessionPathId !== session.id
                                    ? "hover:bg-slate-300 dark:hover:bg-[#37393b]"
                                    : "hover:bg-white dark:hover:bg-[#c2e7ff]"
                                )}
                              >
                                <assets.OptionIcon
                                  width={24}
                                  height={24}
                                  className='cursor-pointer duration-500 fill-[#1f1f1f] dark:fill-white'
                                />
                              </span>
                            </ChatOptionsDropdown>
                          </li>
                        </ActionTooltip>
                      </>
                    ))
                    .filter((session: any) => session.length !== null)}
                </ul>
              </>
            )}
          </div>
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
        </ul>
      </div>
    </nav>
  );
};
export default SidebarDrawer;
