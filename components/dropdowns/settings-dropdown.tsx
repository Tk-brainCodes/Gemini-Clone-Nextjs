import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { assets } from "@/assets";
import { cn } from "@/lib/utils";
import Switch from "@mui/material/Switch";
import ActionTooltip from "../action-tooltip";
import useDarkMode from "@/hooks/toggle-theme";

const SettingsDropdown = ({ children }: { children: ReactNode }) => {
  const { darkMode, handleSetDarkMode, handleSetLightMode } = useDarkMode();

  const handleToggleTheme = () => {
    if (darkMode) {
      handleSetLightMode();
    } else {
      handleSetDarkMode();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex p-2 cursor-pointer dark:hover:bg-[#444746] hover:bg-light-white text-[#444746]  text-sm items-center font-semibold w-full gap-x-4 hover:bg-slate-200 rounded-[20px]"
        )}
      >
        <ActionTooltip side='right' align='center' label='Settings'>
          {children}
        </ActionTooltip>
      </DropdownMenuTrigger>
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
          <span className='dark:text-white text-[#1f1f1f]'>Extensions</span>
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
            <span className=' dark:text-white text-[#1f1f1f]'>Dark theme</span>
          </div>
          <Switch
            defaultChecked
            checked={darkMode}
            onChange={handleToggleTheme}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsDropdown;
