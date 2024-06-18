"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import ActionTooltip from "@/components/action-tooltip";
import { assets } from "@/assets";

import Image from "next/image";

const SidebarDrawer = () => {
  //TODO: Migrate to redux
  const [open, setOpen] = useState(true);

  return (
    <div className='flex'>
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-[#f0f4f9] h-screen p-5  pt-4 relative z-10 duration-300`}
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
        <ul className='pt-6'>
          <ActionTooltip side='bottom' align='center' label='New chat'>
            <li
              className={cn(
                "flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-[#444746] bg-[#dde3ea] text-sm items-center font-semibold  gap-x-4",
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
            </li>
          </ActionTooltip>

          <div className=''>
            {open && (
              <>
                <li className='text-[14px] font-semibold leading-[20px] text-[#1f1f1f] mt-6'>
                  Recent
                </li>
              </>
            )}
          </div>

          <div className='mt-[15.5em]'>
            <ActionTooltip side='right' align='center' label='Help'>
              <li
                className={cn(
                  "flex rounded-[20px] p-2 cursor-pointer hover:bg-light-white text-[#444746]  text-sm items-center font-semibold  gap-x-4 hover:bg-slate-200"
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
                  "flex rounded-[20px] p-2 cursor-pointer hover:bg-light-white text-[#444746]  text-sm items-center font-semibold  gap-x-4 hover:bg-slate-200"
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
                  "flex p-2 cursor-pointer hover:bg-light-white text-[#444746]  text-sm items-center font-semibold  gap-x-4 hover:bg-slate-200 rounded-[20px]"
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
