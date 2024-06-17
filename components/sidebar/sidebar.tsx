import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { assets } from "@/assets";
import { cn } from "@/lib/utils.js";

import Image from "next/image";

const SidebarDrawer = () => {
//TODO: Migrate to redux 
  const [open, setOpen] = useState(true);

  return (
    <div className='flex bg-[#f0f4f9]'>
      <div
        className={` ${
          open ? "w-72" : "w-20 "
        } bg-dark-purple h-screen p-5  pt-4 relative z-10 duration-300`}
      >
        <div className='flex gap-x-4 items-center'>
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
        </div>
        <ul className='pt-6'>
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
          </div>
        </ul>
      </div>
    </div>
  );
};
export default SidebarDrawer;
