"use client";

import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";
import { assets } from "@/assets";
import { useRouter, usePathname } from "next/navigation";
import { setCurrentSession } from "@/redux/conversationSlice";
// import { createDynamicTitle } from "@/lib/langchain";

import Image from "next/image";
import {
  startNewSession,
  selectSessions,
  fetchChatsSession,
  isOpen,
  setOpen,
} from "@/redux/conversationSlice";

const SidebarDrawer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(selectSessions);
  const open = useAppSelector(isOpen);
  const currentSessionPathId = pathname.split("/").pop();

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
    memoizedFetchSession();
  }, [memoizedFetchSession]);

  const handleToggle = () => {
    dispatch(setOpen());
  };

  // const prompTitles = sessions.map((session) => {
  //   return session.messages.length > 0 && session.messages[0].text;
  // });

  // console.log("prompt titles", prompTitles)

  // const generateSidebarTitle = async () => {
  //   const title = await createDynamicTitle(prompTitles);
  // };

  return (
    <nav>
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-[#f0f4f9] h-[100vh] p-5 z-40 pt-4 top-0 left-0 duration-300 flex flex-col items-start justify-between`}
      >
        <div className='flex flex-col gap-x-4 items-start justify-center'>
          <ActionTooltip side='bottom' align='center' label='Expand menu'>
            <Button
              onClick={handleToggle}
              className='bg-0 hover:bg-0 flex px-2 py-2 w-[50px] h-[50px] items-center justify-center rounded-full  cursor-pointer'
            >
              <Image
                src={assets.menu_icon}
                className={`cursor-pointer duration-500`}
                alt='menu_icon'
              />
            </Button>
          </ActionTooltip>

          <div className='mt-[3em]'>
            <ActionTooltip side='bottom' align='center' label='New chat'>
              <Button
                onClick={handleNewChat}
                className={cn(
                  "flex   rounded-md p-2 cursor-pointer hover:bg-light-white text-[#444746] bg-[#dde3ea] text-sm items-center font-semibold  gap-x-4",
                  open ? "rounded-[20px] w-[150px]" : "rounded-full"
                )}
                disabled={pathname === "/new-chat" ? true : false}
              >
                <Image src={assets.plus_icon} alt='plus_icon' />
                <span
                  className={`leading-[20px] text-[14px] ${
                    !open && "hidden"
                  } origin-left duration-200`}
                >
                  New chat
                </span>
              </Button>
            </ActionTooltip>
          </div>

          <div className='w-full'>
            {open && (
              <>
                <li className='text-[14px] list-none font-semibold leading-[20px] text-[#1f1f1f] mt-6'>
                  {sessions.length > 0 && "Recent"}
                </li>
                <ul className='h-[188px] w-full overflow-x-hidden overflow-y-auto'>
                  {sessions
                    .filter((session: any) => session.messages.length > 0)
                    .map((session: any) => (
                      <>
                        <ActionTooltip
                          key={session.id}
                          side='right'
                          align='center'
                          label={
                            session.messages.length > 0 &&
                            session.messages[0].text
                          }
                        >
                          <li
                            className={cn(
                              "w-full text-[14px] gap-[10px] flex items-center justify-between list-none group font-normal px-3 py-2 rounded-[30px] leading-[20px] text-[#444746] mt-2 cursor-pointer",
                              currentSessionPathId === session.id
                                ? "text-[#041e49] bg-[#d3e3fd]"
                                : "hover:bg-[#E9EEF6]"
                            )}
                            onClick={() => handleSessionClick(session.id)}
                          >
                            <span className='line-clamp-1 flex gap-x-4 items-start justify-start'>
                              <div className='w-[24px] h-[24px]'>
                                {" "}
                                <Image
                                  src={assets.chat_bubble}
                                  alt='plus_icon'
                                  className='w-[20px]'
                                />
                              </div>
                              {session.messages.length > 0 &&
                                session.messages[0].text}
                            </span>
                            <span className='w-[28px] hidden group-hover:flex h-[28px] group-hover:items-center group-hover:justify-center rounded-full hover:bg-white'>
                              <Image
                                className='w-[20px]'
                                src={assets.option}
                                alt='plus_icon'
                              />
                            </span>
                          </li>
                        </ActionTooltip>
                      </>
                    ))}
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
                  "flex rounded-[20px] p-2 cursor-pointer hover:bg-light-white text-[#444746]  text-sm items-center w-full font-semibold  gap-x-4 hover:bg-slate-200"
                )}
              >
                <Image src={assets.help} alt='plus_icon' />
                <span
                  className={`leading-[20px] text-[14px] ${
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
                  "flex rounded-[20px] p-2 cursor-pointer hover:bg-light-white text-[#444746]  text-sm items-center w-full font-semibold  gap-x-4 hover:bg-slate-200"
                )}
              >
                <Image src={assets.history_icon} alt='plus_icon' />
                <span
                  className={`leading-[20px] text-[14px] ${
                    !open && "hidden"
                  } origin-left duration-200`}
                >
                  Activity
                </span>
              </li>
            </ActionTooltip>
            <ActionTooltip side='right' align='center' label='Settings'>
              <li
                className={cn(
                  "flex p-2 cursor-pointer hover:bg-light-white text-[#444746]  text-sm items-center font-semibold w-full gap-x-4 hover:bg-slate-200 rounded-[20px]"
                )}
              >
                <Image src={assets.settings_icon} alt='plus_icon' />
                <span
                  className={`leading-[20px] text-[14px] ${
                    !open && "hidden"
                  } origin-left duration-200`}
                >
                  Settings
                </span>
              </li>
            </ActionTooltip>
          </div>
        </ul>
      </div>
    </nav>
  );
};
export default SidebarDrawer;
