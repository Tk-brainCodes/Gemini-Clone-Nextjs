"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import {
  selectStatus,
  selectError,
  selectSessions,
  selectCurrentSession,
} from "@/redux/conversationSlice";
import { fetchChatsSession } from "@/redux/conversationThunk";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { ChatSession } from "@/types/conversation-types";
import useSpeechSynthesis from "@/hooks/read-audio";

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

  const customStyles = {
    fontFamily: '"Google Sans", sans-serif',
    fontsize: "18px",
    fontWeight: 400,
    lineHeight: "18px",
    padding: " 16px 16px 22px",
    backgroundColor: "#f0f4f9",
    borderRadius: "12px 12px 0px 0px",
  };

  return (
    <div className=''>
      <SyntaxHighlighter
        style={docco}
        language={language}
        customStyle={customStyles}
        PreTag='div'
      >
        {value}
      </SyntaxHighlighter>
      <div className='copy_content w-full mt-1 px-4 py-4 h-[40px] bg-[#f0f4f9] flex items-center justify-between'>
        <div className='leading-[16px] text-[16px] font-normal flex text-[#444746] gap-x-2'>
          Use code
          <a className='text-underline text-[#0b57d0] cursor-pointer'>
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

const ChatResponse = () => {
  const sessions: ChatSession[] = useAppSelector(selectSessions);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const currentSession = useAppSelector(selectCurrentSession);
  const currentSessionPathId = pathname.split("/").pop();
  const { user } = useUser();
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const { isSpeaking, isPaused, speak, pause, resume, stop } =
    useSpeechSynthesis();

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentSession?.messages]);

  const memoizedFetchSession = useCallback(() => {
    dispatch(fetchChatsSession());
  }, [dispatch]);

  useEffect(() => {
    memoizedFetchSession();
  }, [memoizedFetchSession]);

  if (error) {
    return <div>Something went wrong {error}</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const handleReadAloud = (text: string) => {
    if (!isSpeaking) {
      speak(text);
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  console.log("sessions", sessions);

  return (
    <div>
      <Toaster position='bottom-left' />
      <div className='mt-[2em]'>
        {status === "loading" && <h1>LOADING SESSION</h1>}
        {sessions
          .filter((curSession) => curSession.id === currentSessionPathId)
          .map((session) => (
            <div key={session.id}>
              {session.messages.map((message, index) => (
                <div
                  key={index}
                  className={`my-10 w-full ${
                    message.sender === "ai" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className='markdown-content w-[712px] flex flex-col items-start justify-start gap-[22px] text-[17px] font-normal text-base leading-[1.7] text-[#1f1f1f]'>
                    <div className='flex items-center w-full group gap-[20px]'>
                      {message.sender == "user" ? (
                        <Image
                          src={user?.imageUrl as string}
                          alt='gemini_icon'
                          className='w-[38px] h-[38px] mt-[0.7em] cursor-pointer rounded-full'
                          loading='lazy'
                          width={500}
                          height={500}
                          blurDataURL={user?.imageUrl as string}
                          placeholder='blur'
                        />
                      ) : (
                        ""
                      )}
                      <div className='flex items-center justify-start gap-x-3 flex-1 mx-2 relative'>
                        <span>
                          {message.sender === "user" ? message.text : ""}
                        </span>
                        {message.sender === "user" && (
                          <div className='w-[40px] h-[40px] items-center justify-center rounded-full group-hover:flex hidden group-hover:bg-[#f0f4f9] ml-3'>
                            <Image
                              src={assets.edit_icon}
                              alt='edit_icon'
                              className='w-[24px] h-[24px] cursor-pointer'
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <section className='w-full'>
                      {message.sender === "ai" && (
                        <div className='w-full flex items-end justify-end gap-x-2 group mb-[20px]'>
                          <Button
                            onClick={() => handleReadAloud(message.text)}
                            className='px-2 py-2 hover:bg-[#f0f4f9] rounded-full'
                          >
                            <Image
                              src={assets.volume_up}
                              alt='edit_icon'
                              className='w-[25px] h-[25px] cursor-pointer'
                            />
                          </Button>
                        </div>
                      )}
                      <div className='flex items-start justify-start gap-[20px]'>
                        {message.sender == "ai" ? (
                          <Image
                            src={assets.gemini_icon}
                            alt='gemini_icon'
                            className='w-[34px] h-[34px] rounded-full -mt-[0.2em] '
                          />
                        ) : (
                          ""
                        )}
                        {message.sender === "ai" && (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            className='w-full'
                            components={{
                              code({
                                node,
                                //@ts-ignore
                                inline,
                                className,
                                children,
                                ...props
                              }) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
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
                    </section>
                  </div>
                </div>
              ))}
            </div>
          ))}
        {status === "loading" && (
          <div className='flex items-start justify-start gap-x-4'>
            <Image
              src={assets.gemini_icon}
              alt='gemini_icon'
              className='w-[34px] h-[34px] spin_animation rounded-full -mt-[0.4em] '
            />
            <div className='flex items-start gap-[20px]'>
              <div className='w-[700px] flex flex-col gap-[12px] mb-[1em]'>
                <hr className='skeleton-loader' />
                <hr className='skeleton-loader' />
                <hr className='skeleton-loader w-[70%]' />
              </div>
            </div>
          </div>
        )}
      </div>
      <div ref={messageContainerRef} className='mb-[1em]' />
    </div>
  );
};

export default ChatResponse;
