"use client";

import Image from "next/image";
import { static_data } from "@/lib/static-data";
import { useUser } from "@clerk/nextjs";
import { StaticDataItem } from "@/types/static-card-types";

type Props = {};

const WelcomeScreen = (props: Props) => {
  const { user } = useUser();

  return (
    <div className='w-fit h-fit flex flex-col'>
      <span className='font-semibold -mt-[3em]'>
        <p className='gradient-text text-[56px] leading-[64px] text-[#c4c7c5]'>
          Hello, {user?.firstName}
        </p>
        <p className='text-[#c4c7c5] text-[56px] leading-[64px]'>
          How can I help you today?
        </p>
      </span>
      <div className='flex items-center justify-start gap-x-3 mt-[7em] mb-[3em]'>
        {static_data.map(({ prompt, icon: Icon }: StaticDataItem) => (
          <div
            key={prompt}
            className='h-[230px] w-[230px] p-[15px] bg-[#f0f4f9] dark:hover:bg-[#333537] dark:bg-[#1e1f20] rounded-[13px] relative cursor-pointer hover:bg-[#dfe4ed]'
          >
            <p className='prompt-text-content dark:text-white text-[#1F1F1F] text-[16px] flex flex-col items-start'>
              {prompt}
            </p>
            <span className='w-[40px] h-[40px] mb-[0.5em] p-[5px] dark:bg-black bg-white rounded-full flex items-center justify-center right-[10px] bottom-[10px] absolute'>
              <Icon
                width={24}
                height={24}
                className='fill-dark dark:fill-white'
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
