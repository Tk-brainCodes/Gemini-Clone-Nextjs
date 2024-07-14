"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import {
  addUserMessage,
  selectCurrentSession,
  selectStatus,
  selectCurrentSessionId,
  startNewSession,
  setCurrentSession,
} from "@/redux/conversationSlice";
import { sendUserPropmtToAI, saveChatSession } from "@/redux/conversationThunk";
import { assets } from "@/assets";
import { cn } from "@/lib/utils";
import useSpeechToText from "@/hooks/speech-to-text";
import ActionTooltip from "@/components/action-tooltip";
import Image from "next/image";

const PromptInput = () => {
  const { isListening, transcript, startListening, stopListening } =
    useSpeechToText();
  const [inputText, setInputText] = useState<string>(transcript);
  const [isTalking, setIsTalking] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const currentSession = useAppSelector(selectCurrentSession);
  const currentSessionId = useAppSelector(selectCurrentSessionId);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    setInputText((prevInputText) => prevInputText + transcript);
  }, [transcript]);

  useEffect(() => {
    if (isListening) {
      setIsTalking(true);
    } else {
      setTimeout(() => setIsTalking(false), 1000);
    }
  }, [isListening]);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    if (currentSession?.id) {
      dispatch(
        addUserMessage({ sessionId: currentSession.id, text: inputText })
      );
      await dispatch(sendUserPropmtToAI({ prompt: inputText }));
      await dispatch(saveChatSession());
      setInputText("");
      router.push(`/chat/${currentSession.id}`);
    } else {
      await dispatch(startNewSession());
      const newSessionId = currentSessionId;

      if (newSessionId) {
        dispatch(setCurrentSession(newSessionId));
        dispatch(addUserMessage({ sessionId: newSessionId, text: inputText }));
        await dispatch(sendUserPropmtToAI({ prompt: inputText }));
        await dispatch(saveChatSession());
        router.push(`/chat/${newSessionId}`);
        setInputText("");
      }
    }
  };

  return (
    <div className=' h-fit bg-white z-10 w-[75vw] flex flex-col fixed bottom-0 items-center justify-center'>
      <div className='search-box'>
        <div className='prompt_input relative flex items-start justify-center'>
          <textarea
            placeholder={isTalking ? "Listening..." : "Enter a text here"}
            className='flex-1 h-[50px] w-[690px] text-[#1f1f1f] bg-transparent border-1 border-blue-400 outline-none focus:outline-none focus:border-none focus:ring-0 whitespace-nowrap text-[18px]'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
        </div>

        <div className='flex gap-x-2 mt-2'>
          <ActionTooltip align='center' side='top' label='Upload Image'>
            <span className='rounded-full w-[50px] h-[50px] hover:bg-slate-200 px-2 py-2 flex items-center justify-center'>
              <Image
                src={assets.add_photo}
                alt='gallery-icon'
                className='w-[24px] cursor-pointer'
              />
            </span>
          </ActionTooltip>

          <ActionTooltip align='center' side='top' label='Use microphone'>
            <span
              onClick={isListening ? stopListening : startListening}
              className={cn(
                "rounded-full w-[50px] h-[50px] hover:bg-slate-200 px-2 py-2 flex items-center justify-center",
                isListening && "bg-[#f0f4f9] shadow-md"
              )}
            >
              {isListening && (
                <span className='absolute w-[65px] h-[63px] rounded-full bg-[#d3e3fd] opacity-55 motion-safe:animate-ping'></span>
              )}
              <Image
                src={assets.mic_icon}
                alt='mic-icon'
                className='w-[24px] cursor-pointer'
              />
            </span>
          </ActionTooltip>
          {status === "loading" ? (
            <ActionTooltip align='center' side='top' label='Stop'>
              <span className='rounded-full w-[50px] h-[50px] hover:bg-slate-200 px-2 py-2 flex items-center justify-center'>
                <Image
                  src={assets.stop}
                  alt='stop icon'
                  className='w-[24px] cursor-pointer'
                />
              </span>
            </ActionTooltip>
          ) : (
            <ActionTooltip align='center' side='top' label='Submit'>
              <span
                className='rounded-full w-[50px] h-[50px] hover:bg-slate-200 px-2 py-2 flex items-center justify-center'
                onClick={handleGenerate}
              >
                <Image
                  src={assets.send_icon}
                  alt='send icon'
                  className='w-[24px] cursor-pointer'
                />
              </span>
            </ActionTooltip>
          )}
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
  );
};

export default PromptInput;
