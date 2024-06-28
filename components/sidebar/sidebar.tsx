"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";
import { assets } from "@/assets";
import { useRouter } from 'next/navigation'

import Image from "next/image";
import {
  selectCurrentSessionId,
  startNewSession,
  setCurrentSession,
  selectSessions,
} from "@/redux/conversationSlice";

const SidebarDrawer = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sessions = useAppSelector(selectSessions);
  const newSessionId = useAppSelector(selectCurrentSessionId);
  const [open, setOpen] = useState(false);

  const handleNewChat = () => {
    dispatch(startNewSession());
    // router.push(`/chat/${newSessionId}`);
  };

  const handleSessionClick = (id: string) => {
    dispatch(setCurrentSession(id));
    router.push(`/chat/${id}`);
  };

  return (
    <div className='flex'>
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-[#f0f4f9] h-screen p-5  pt-4 relative z-10 duration-300 flex flex-col items-start justify-between`}
      >
        <div className='flex gap-x-4 items-center'>
          <ActionTooltip side='bottom' align='center' label='Expand menu'>
            <Button
              onClick={() => setOpen(!open)}
              className='bg-0 hover:bg-0 flex px-2 py-2 w-[50px] h-[50px] items-center justify-center rounded-full  cursor-pointer'
            >
              <Image
                src={assets.menu_icon}
                className={`cursor-pointer duration-500`}
                alt='menu_icon'
              />
            </Button>
          </ActionTooltip>
        </div>

        <div className=''>
          <ActionTooltip side='bottom' align='center' label='New chat'>
            <Button
              onClick={handleNewChat}
              className={cn(
                "flex   rounded-md p-2 cursor-pointer hover:bg-light-white text-[#444746] bg-[#dde3ea] text-sm items-center font-semibold  gap-x-4",
                open ? "rounded-[20px] w-[150px]" : "rounded-full"
              )}
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

          <div className=''>
            {open && (
              <>
                <li className='text-[14px] list-none font-semibold leading-[20px] text-[#1f1f1f] mt-6'>
                  Recent
                </li>
                <ul className="">
                  {sessions.map((session) => (
                    <li
                      key={session.id}
                      className='text-[14px] list-none font-semibold leading-[20px] text-[#444746] mt-2 cursor-pointer'
                      onClick={() => handleSessionClick(session.id)}
                    >
                      {session.messages.length > 0
                        ? session.messages[0].text
                        : "New chat"}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <ul className='pt-6'>
          <div className='mt-[15.5em]'>
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
    </div>
  );
};
export default SidebarDrawer;
