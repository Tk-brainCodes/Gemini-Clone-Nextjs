"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addUserMessage,
  fetchGeneratedText,
  selectCurrentSession,
  selectStatus,
  selectError,
} from "@/redux/conversationSlice";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster, toast } from "sonner";
import ActionTooltip from "@/components/action-tooltip";
import WelcomeScreen from "./welcome-screen";

const CodeBlock = ({
  language,
  value,
}: {
  language: string;
  value: string;
}) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(value);
    toast("Copied to clipboard");
  };

  return (
    <div className='relative'>
      <SyntaxHighlighter
        className='px-4 py-4  bg-[#f0f4f9] rounded-t-lg rounded-tr-lg'
        style={docco}
        language={language}
        PreTag='div'
      >
        {value}
      </SyntaxHighlighter>
      <div className='copy_content w-full mt-1 px-4 py-4 h-[40px] bg-[#f8f8ff] flex items-center justify-between'>
        <div className='leading-[14px] text-[#444746]'>
          Use code
          <a className='text-underline text-[16px] text-[#0b57d0] cursor-pointer'>
            with caution
          </a>
        </div>
        <Image
          src={assets.content_copy}
          alt='cotent_copy'
          onClick={handleCopyClick}
          className='cursor-pointer'
        />
      </div>
    </div>
  );
};

const AITextGenerator: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const currentSession = useAppSelector(selectCurrentSession);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);;

  const handleGenerate = () => {
    if (currentSession) {
      dispatch(
        addUserMessage({ sessionId: currentSession.id, text: inputText })
      );
      dispatch(fetchGeneratedText({ prompt: inputText }));
      setInputText("");
    }
  };

  return (
    <div className='w-full bg-white h-screen pb-[15vh] relative overflow-x-hidden'>
      <Toaster position='bottom-left' />
      <div className='flex items-center justify-between h-[40px] px-4 py-2 mt-5 relative right-0 w-full'>
        <DropdownMenu>
          <DropdownMenuTrigger className='text-[20px] leading-[28px] text-[#5f6368] flex items-center justify-center gap-x-2'>
            <span>Gemini</span>
            <Image src={assets.arrow_dropdown} alt='arrow_dropdown' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Gemini</DropdownMenuItem>
            <DropdownMenuItem>Gemini Advanced</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className='flex gap-x-4'>
          <Button className='bg-[#dde3ea] text-[#000000] font-normal'>
            Try Gemini Advanced
          </Button>
          <ActionTooltip align='center' side='bottom' label='Google apps'>
            <Button className='bg-0 hover:bg-0 px-2 py-2 flex items-center justify-center'>
              <Image src={assets.google_apps} alt='google_apps' />
            </Button>
          </ActionTooltip>

          <Image
            src={assets.user_icon}
            alt='user_icon'
            className='w-[40px] h-[40px] rounded-full cursor-pointer'
          />
        </div>
      </div>

      <section className='flex flex-col items-center justify-start'>
        <div className='result w-[712px] mt-[2em]'>
          {currentSession?.messages.map((message, index) => (
            <div
              key={index}
              className={`my-10 w-full ${
                message.sender === "ai" ? "flex-row-reverse" : ""
              }`}
            >
              <div className='markdown-content w-[712px] flex flex-col items-start justify-start gap-[22px] text-[17px] font-normal text-base leading-[1.7] text-[#1f1f1f] group'>
                <div className='flex items-center w-full group gap-[20px]'>
                  <>
                    {message.sender === "user" ? (
                      <Image
                        src={assets.user_icon}
                        alt='user_icon'
                        className='w-[36px] h-[36px] cursor-pointer rounded-full'
                      />
                    ) : (
                      ""
                    )}
                  </>

                  <div className='flex-1 mx-2'>
                    {message.sender === "user" ? message.text : ""}
                  </div>
                  {message.sender === "user" && (
                    <div className='hidden group-hover:block'>
                      <Image
                        src={assets.edit_icon}
                        alt='edit_icon'
                        className='w-[24px] cursor-pointer'
                      />
                    </div>
                  )}
                </div>

                <div className='flex items-start justify-start gap-[20px]'>
                  <Image
                    src={message.sender === "ai" ? assets.gemini_icon : ""}
                    alt='gemini_icon'
                    className='w-[32px] h-[32px] mt-[0.7em] cursor-pointer rounded-full'
                  />
                  {message.sender === "ai" && (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className='w-full'
                      components={{
                        //@ts-ignore
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <CodeBlock
                              language={match[1]}
                              value={String(children).replace(/\n$/, "")}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  )}
                </div>

                {message.sender === "user" && (
                  <div className='w-full flex items-end justify-end gap-x-2 mt-2'>
                    <Button className='bg-none text-[14px] text-[#1f1f1f] flex gap-x-2'>
                      Show draft
                      <Image
                        src={assets.keyboard_arrow}
                        alt='edit_icon'
                        className='w-[24px] cursor-pointer'
                      />
                    </Button>
                    <Button className='px-2 py-2 rounded-full'>
                      <Image
                        src={assets.volume_up}
                        alt='edit_icon'
                        className='w-[30px] h-[30px] cursor-pointer'
                      />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {status === "loading" && (
            <div className='flex items-start gap-[20px]'>
              <div className='w-[700px] flex flex-col gap-[10px]'>
                <hr className='skeleton-loader' />
                <hr className='skeleton-loader' />
                <hr className='skeleton-loader w-[70%]' />
              </div>
            </div>
          )}
        </div>

        {currentSession &&
        currentSession.messages.length === 0 &&
        status !== "loading" ? (
          <WelcomeScreen />
        ) : (
          ""
        )}

        <div className='background-gradient w-[80vw] flex flex-col fixed bottom-0 items-center justify-center'>
          <div className='search-box mt-[1em]'>
            <div className='relative flex items-center'>
              <textarea
                placeholder='Enter a text here'
                className='flex-1 h-[50px] w-[690px] text-[#1f1f1f] bg-transparent border-1 border-blue-400 outline-none focus:outline-none focus:border-none focus:ring-0 p-[8px] text-[18px]'
                style={{ whiteSpace: "pre-wrap" }}
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
                <span className='rounded-full w-[50px] h-[50px] hover:bg-slate-200 px-2 py-2 flex items-center justify-center'>
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
                      src={assets.stop_icon}
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
      </section>
    </div>
  );
};

export default AITextGenerator;
