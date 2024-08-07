"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
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
  const [inputActive, setInputActive] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isHovered, setIsHovered] = useState(false);

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
      if (image) {
        await dispatch(
          sendUserPropmtToAI({
            prompt: inputText,
            image,
          })
        );
      } else {
        await dispatch(sendUserPropmtToAI({ prompt: inputText }));
        setImage(null);
      }
      await dispatch(saveChatSession());
      setInputText("");
      setImage(null);
      router.push(`/chat/${currentSession.id}`);
    } else {
      await dispatch(startNewSession());
      const newSessionId = currentSessionId;

      if (newSessionId) {
        dispatch(setCurrentSession(newSessionId));
        dispatch(addUserMessage({ sessionId: newSessionId, text: inputText }));
        if (image) {
          await dispatch(
            sendUserPropmtToAI({
              prompt: inputText,
              image,
            })
          );
        } else {
          await dispatch(sendUserPropmtToAI({ prompt: inputText }));
          setImage(null);
        }
        await dispatch(saveChatSession());
        router.push(`/chat/${newSessionId}`);
        setInputText("");
        setImage(null);
      }
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFocus = () => {
    setInputActive(true);
  };

  const handleBlur = () => {
    if (inputText.trim() === "") {
      setInputActive(false);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.style.borderRadius = `16px`;
    }
  }, [inputText]);

  return (
    <div className='h-fit bg-white dark:bg-[#131314] px-4 z-10 w-[76vw] max-sm:w-full max-md:w-full flex flex-col fixed bottom-0 items-center justify-center'>
      <div className='search-box dark:bg-[#1e1f20] lg:w-[890px] md:w-[763px] max-sm:w-[90vw] px-4'>
        <div className='flex flex-col gap-x-2'>
          <textarea
            ref={textareaRef}
            placeholder={isTalking ? "Listening..." : "Enter a text here"}
            className='flex-1 dark:text-[#c4c7c5] ml-[1em] p-0 w-full md:w-[660px] bg-transparent mt-[1em] text-[#1f1f1f] border-1 border-blue-400 outline-none focus:outline-none focus:border-none focus:ring-0 text-[18px] resize-none overflow-auto max-h-[250px] min-h-[30px]'
            value={inputText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          {image ? (
            <span
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className='w-fit ml-5 -mt-[1em] mb-[1em] relative flex  items-center justify-center  hover:opacity-50 transition-all ease-in-out
'
            >
              <Image
                src={image}
                alt='Selected'
                className='max-w-[100px] max-h-[100px] w-[50px] h-[50px] rounded-[10px]'
                loading='lazy'
                width={500}
                height={500}
              />

              {isHovered && (
                <assets.Close
                  className='fill-white w-[24px] cursor-pointer absolute'
                  width={24}
                  height={24}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                  }}
                />
              )}
            </span>
          ) : (
            ""
          )}

          <input
            type='file'
            accept='image/*'
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        <div className='flex gap-x-2  items-center'>
          <ActionTooltip align='center' side='top' label='Upload Image'>
            <span
              className='rounded-full w-[50px] h-[50px] dark:hover:bg-[#37393b] hover:bg-slate-200 px-2 py-2 flex items-center justify-center'
              onClick={handleButtonClick}
            >
              <assets.AddPhotoIcon
                width={24}
                height={24}
                className='w-[24px] fill-black dark:fill-white cursor-pointer'
              />
            </span>
          </ActionTooltip>

          <ActionTooltip align='center' side='top' label='Use microphone'>
            <span
              onClick={isListening ? stopListening : startListening}
              className={cn(
                "rounded-full w-[50px] h-[50px] hover:bg-slate-200 dark:hover:bg-[#37393b] px-2 py-2 flex items-center justify-center",
                isListening && "bg-[#f0f4f9] dark:bg-[#e3e3e3] shadow-md"
              )}
            >
              {isListening && (
                <span className='absolute w-[65px] h-[63px] rounded-full bg-[#37393b] opacity-55 motion-safe:animate-ping'></span>
              )}
              <assets.MicIcon
                width={24}
                height={24}
                className='w-[24px] fill-black dark:fill-white cursor-pointer'
              />
            </span>
          </ActionTooltip>
          {status === "loading" ? (
            <ActionTooltip align='center' side='top' label='Stop'>
              <span
                className={cn(
                  "rounded-full w-[50px] h-[50px] dark:hover:bg-[#37393b] hover:bg-slate-200 px-2 py-2 flex items-center justify-center dark:bg-[#37393b] bg-[#f0f4f9]"
                )}
              >
                <assets.StopIcon
                  width={24}
                  height={24}
                  className='w-[24px] fill-black dark:fill-white cursor-pointer'
                />
              </span>
            </ActionTooltip>
          ) : (
            <ActionTooltip align='center' side='top' label='Submit'>
              <span
                className={cn(
                  "rounded-full w-[50px] h-[50px] dark:hover:bg-[#37393b] hover:bg-slate-200 px-2 py-2  transition-transform duration-300 ease-in-out",
                  {
                    "opacity-100 transform translate-x-0 flex items-center justify-center":
                      inputActive,
                    "opacity-0 transform translate-x-full absolute":
                      !inputActive,
                  }
                )}
                onClick={handleGenerate}
              >
                <assets.SendIcon
                  width='24px'
                  height='24px'
                  className={cn(
                    "w-[24px] fill-black cursor-pointer dark:fill-white"
                  )}
                />
              </span>
            </ActionTooltip>
          )}
        </div>
      </div>

      <p className='mx-auto my-15px text-[14px] text-center dark:text-[#c4c7c5] text-black font-normal mt-[0.5em] mb-[0.5em] gap-x-2'>
        Gemini may display inaccurate info, including about people, so
        double-check its responses.
        <span className='underline dark:text-[#c4c7c5] cursor-pointer'>
          Your privacy & Gemini Apps
        </span>
      </p>
    </div>
  );
};

export default PromptInput;
