"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setPrompt,
  fetchGeneratedText,
  selectPrompt,
  selectGeneratedText,
  selectStatus,
} from "@/redux/conversationSlice";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ActionTooltip from "@/components/action-tooltip";

import Image from "next/image";
import { assets } from "@/assets";
import { static_data } from "@/lib/static-data";

const AITextGenerator = ({ user }: { user: any }) => {
  const [userId, setUserId] = useState<string>("");
  const dispatch = useAppDispatch();
  const prompt = useAppSelector(selectPrompt);
  const generatedText = useAppSelector(selectGeneratedText);
  const status = useAppSelector(selectStatus);

    useEffect(() => {
    if (!user) {
      localStorage.setItem('userId', user);
    }
    setUserId(user);
  }, [user]);

  return (
    <div className='w-full bg-white  h-[100vh] pb-[15vh] relative overflow-x-hidden'>
      <div className='flex items-center justify-between h-[40px] px-4 py-2 mt-5 relative right-0 w-full'>
        <DropdownMenu>
          <DropdownMenuTrigger className='text-[20px] leading-[28px] text-[#5f6368] flex items-center justify-center gap-x-2 '>
            <span className=''>Gemini</span>
            <Image src={assets.arrow_dropdown} alt='arrow_dropdown' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Gemini</DropdownMenuItem>
            <DropdownMenuItem>Gemini Advanced</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className='flex gap-x-4 '>
          <Button
            variant='outline'
            className='bg-[#dde3ea] text-[#000000] font-normal'
          >
            Try Gemini Advanced
          </Button>
          <ActionTooltip align='center' side='bottom' label='Google apps'>
            <Button className='bg-0 hover:bg-0 px-2 py-2 flex items-center justify-center'>
              <Image src={assets.google_apps} alt='google_apps' />
            </Button>
          </ActionTooltip>

          {/* <Image
              src={assets.user_icon}
              alt='user-profile-icon'
              className='w-[40px] h-[40px] rounded-full'
            /> */}
        </div>
      </div>

     <section className="flex flex-col items-center justify-start  mt-[3em]"> 
           {/*Card body*/}
     
     <div className="w-fit h-fit flex flex-col"> 
         <span className='font-semibold mt-[2em]'>
          <p className='gradient-text text-[56px] leading-[64px] text-[#c4c7c5]'>Hello, Eboreime</p>
          <p className='text-[#c4c7c5] text-[56px] leading-[64px]'>How can I help you today?</p>
        </span>
        <div className='flex items-center justify-start gap-x-3 mt-[7em]'>
          {static_data.map(
            ({ prompt, icon }: { prompt: string; icon: string }) => (
              <div
                key={prompt}
                className='h-[200px] w-[230px] p-[15px] bg-[#f0f4f9] rounded-[13px] relative cursor-pointer hover:bg-[#dfe4ed]'
              >
                <p className='text-black text-[17px] flex flex-col items-start '>
                  {prompt}
                </p>
                <span className='w-[40px] h-[40px] p-[5px] bg-white rounded-full flex items-center justify-center right-[10px] bottom-[10px] absolute'>
                  <Image src={icon} alt={`${icon}`} />
                </span>
              </div>
            )
          )}
        </div>
     </div>

      {/*Search input container*/}
      <div className=' background-gradient h-[130px] w-full flex flex-col fixed bottom-0 items-center justify-center bg-gradient-to-b from-transparent via-white to-white'>
        <div className='search-box mt-[1em]'>
          <textarea
            placeholder='Enter a text here'
            className='flex-1 h-[50px] w-[690px] bg-transparent border-1 border-blue-400 outline-none focus:outline-none focus:border-none focus:ring-0 p-[8px] text-[18px]'
            style={{ whiteSpace: "pre-wrap" }}
          />

          <div className='flex gap-x-2'>
            <span className='rounded-full w-[50px] h-[50px] hover:bg-slate-200 px-2 py-2 flex items-center justify-center'>
              <Image
                src={assets.add_photo}
                alt='gallery-icon'
                className='w-[24px] cursor-pointer'
              />
            </span>

            <span className='rounded-full w-[50px] h-[50px] hover:bg-slate-200 px-2 py-2 flex items-center justify-center'>
              <Image
                src={assets.mic_icon}
                alt='mic-icon'
                className='w-[24px] cursor-pointer'
              />
            </span>
            <span className='rounded-full w-[50px] h-[50px] hover:bg-slate-200 px-2 py-2 flex items-center justify-center'>
              <Image
                src={assets.send_icon}
                alt='send icon'
                className='w-[24px] cursor-pointer '
              />
            </span>
          </div>
        </div>

        <p className='mx-auto my-15px text-[14px] text-center text-black font-normal mb-1 mt-[1em]'>
          Gemini may display inaccurate info, including about people, so
          double-check its responses.{" "}
          <span className='underline cursor-pointer'>
            Your privacy & Gemini Apps
          </span>
        </p>
      </div>
     </section>
    </div>
  );
};

export default AITextGenerator;
