"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import {
  selectStatus,
  selectError,
  selectSessions,
  selectCurrentSession,
  updateUserMessage,
} from "@/redux/conversationSlice";
import { fetchChatsSession } from "@/redux/conversationThunk";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { ChatSession } from "@/types/conversation-types";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { generateGoogleSearch } from "@/lib/langchain";
import useSpeechSynthesis from "@/hooks/read-audio";
import ActionTooltip from "@/components/action-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import PromptGoogleSearches from "@/components/google-search/prompt-google-searches";
import CodeBlock from "@/components/code-block/code-block";

const ChatResponse = () => {
  const { isSpeaking, isPaused, speak, pause, resume } = useSpeechSynthesis();
  const { user } = useUser();
  const { theme } = useTheme();
  const sessions: ChatSession[] = useAppSelector(selectSessions);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const currentSession = useAppSelector(selectCurrentSession);
  const currentSessionPathId = pathname.split("/").pop();
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [generatedPromptSearch, setGeneratedPromptSearch] = useState<string[]>(
    []
  );
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [audioMessageId, setAudioMessageId] = useState<string | null>(null);
  const [messageId, setMessageId] = useState<string | null>("");
  const [showGoogleSearches, setShowGoogleSearches] = useState(false);
  const [editedText, setEditedText] = useState("");

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
    return <div className='text-rose-400'>Something went wrong, {error}</div>;
  }

  const handleReadAloud = (text: string, messageId: string | null) => {
    if (!isSpeaking) {
      setLoading(true);
      speak(text.replace(/[^\w\s]/gi, "").replace(/\n/g, ""));
      setAudioMessageId(messageId);
      setLoading(false);
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleEditMessage = (messageId: string | null, text: string) => {
    setEditingMessageId(messageId);
    setEditedText(text);
  };

  const handleSaveEdit = async (sessionId: string, messageId: string) => {
    await dispatch(
      updateUserMessage({ sessionId, messageId, text: editedText })
    );
    setEditingMessageId(null);
  };

  const handleShowSearches = async (text: string, id: string | null) => {
    try {
      setMessageId(id);
      setEditedText(text);
      setShowGoogleSearches(!showGoogleSearches);
      setLoadingSearch(true);

      const response = await generateGoogleSearch(text);
      const reponseArray = response.replace(/[^\w\s]/gi, "").split("\n");
      setGeneratedPromptSearch(reponseArray);
      setLoadingSearch(false);
    } catch (error) {
      console.log("error generating google searches", error);
    }
  };

  const handleCopyClick = (value: string) => {
    navigator.clipboard.writeText(value);
    toast("Copied to clipboard");
  };

  return (
    <div>
      <Toaster
        position='bottom-left'
        className='bg-[#444746] text-white dark:bg-white dark:text-[#444746]'
      />
      <div className='mt-[2em]'>
        {sessions
          .filter((curSession) => curSession.id === currentSessionPathId)
          .map((session) => (
            <div key={session.id}>
              {session.messages.map((message, index) => (
                <div
                  key={index}
                  className={`my-10 w-full px-4 max-w-[100vw] md:max-w-[80vw] lg:w-[762px] flex flex-col items-center justify-center  ${
                    message.sender === "ai" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={cn(
                      "markdown-content w-full px-2 py-2 flex flex-col items-start justify-start gap-[22px] text-[17px] font-normal text-base leading-[1.7] text-[#1f1f1f]",
                      theme === "dark" ? "dark-mode" : "light-mode"
                    )}
                  >
                    <div className='flex items-start w-full group gap-[10px]'>
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
                      <div className='flex items-start justify-start gap-x-3 flex-1 mx-2 relative mt-1'>
                        {editingMessageId === message.id ? (
                          <>
                            {message.sender === "user" ? (
                              <div className='flex flex-col'>
                                <Input
                                  value={editedText}
                                  onChange={(e) =>
                                    setEditedText(e.target.value)
                                  }
                                  className='lg:w-[100vw] max-sm:w-full max-w-[90vw] md:max-w-[616px] h-[57px] border-2 border-blue-300 focus:outline-none focus:ring  rounded-[6px] focus:ring-blue-600 dark:text-white text-black'
                                />
                                <div className='flex gap-x-3 mt-[2em]'>
                                  <Button
                                    onClick={() => setEditingMessageId(null)}
                                    className='background-none text-[3a8c7fa] dark:text-[#a8c7fa] dark:hover:bg-[#131314]'
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    className={cn(
                                      "text-[#062e6f] bg-[#a8c7fa] rounded-[20px]"
                                    )}
                                    onClick={() =>
                                      handleSaveEdit(
                                        currentSession?.id || "",
                                        message.id || ""
                                      )
                                    }
                                    disabled={status === "loading"}
                                  >
                                    Update
                                  </Button>
                                </div>
                              </div>
                            ) : null}
                          </>
                        ) : (
                          <>
                            {message.sender === "user" ? (
                              <span className='dark:text-white mt-[0.5em]'>
                                {message.text}
                              </span>
                            ) : null}
                          </>
                        )}
                        {message.sender === "user" && (
                          <div className='w-[40px] h-[40px] items-center justify-center rounded-full group-hover:flex hidden dark:group-hover:bg-[#37393b] group-hover:bg-[#f0f4f9] ml-3'>
                            <ActionTooltip
                              align='center'
                              side='bottom'
                              label='Edit text'
                            >
                              <assets.EditIcon
                                className='w-[24px] h-[24px] cursor-pointer fill-[#1f1f1f] dark:fill-white'
                                width={24}
                                height={24}
                                onClick={() =>
                                  handleEditMessage(message.id, message.text)
                                }
                              />
                            </ActionTooltip>
                          </div>
                        )}
                      </div>
                    </div>

                    <section className='w-full'>
                      {message.sender === "ai" && (
                        <div className='w-full flex items-end justify-end  mb-[20px]'>
                          <ActionTooltip
                            align='center'
                            side='bottom'
                            label={
                              !isSpeaking
                                ? "listen"
                                : isPaused
                                ? "resume"
                                : "pause"
                            }
                          >
                            <Button
                              onClick={() =>
                                handleReadAloud(message.text, message.id)
                              }
                              className={cn(
                                "w-[40px] h-[40px] p-2 rounded-full bg-[#f0f4f9] dark:bg-[#1e1f20]",
                                {
                                  "opacity-50 cursor-not-allowed": loading,
                                }
                              )}
                              disabled={loading}
                            >
                              {audioMessageId === message.id &&
                              isSpeaking &&
                              !isPaused ? (
                                <assets.PauseIcon
                                  className='fill-[#1f1f1f] dark:fill-white'
                                  width={24}
                                  height={24}
                                />
                              ) : (
                                <assets.VolumeUpIcon
                                  className='fill-[#1f1f1f] dark:fill-white'
                                  width={24}
                                  height={24}
                                />
                              )}
                            </Button>
                          </ActionTooltip>
                        </div>
                      )}
                      {message.sender === "ai" && (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          className='w-full dark:text-white'
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
                                  //@ts-ignore
                                  theme={theme}
                                />
                              ) : (
                                <code
                                  className={cn(
                                    "p-4 rounded-[4px]",
                                    theme === "light" ? "#f0f4f9" : "c4c7c5",
                                    className
                                  )}
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {message.text}
                        </ReactMarkdown>
                      )}
                      {message.sender === "ai" && (
                        <>
                          <div className='flex gap-x-2 mt-2'>
                            <Button className='' disabled>
                              <assets.ThumbsUp
                                className='fill-[#1f1f1f] w-[20px] h-[20px] dark:fill-white'
                                width={24}
                                height={24}
                              />
                            </Button>
                            <Button disabled>
                              <assets.ThumbsDown
                                className='fill-[#1f1f1f]  w-[20px] h-[20px] dark:fill-white'
                                width={24}
                                height={24}
                              />
                            </Button>
                            <Button>
                              <assets.Share
                                className='fill-[#1f1f1f]  w-[20px] h-[20px] dark:fill-white'
                                width={24}
                                height={24}
                              />
                            </Button>
                            <Button
                              onClick={() =>
                                handleShowSearches(message.text, message.id)
                              }
                              disabled={loadingSearch}
                            >
                              {loadingSearch ? (
                                <assets.ProgressActivityIcon
                                  className=' w-[20px] h-[20px] fill-[#0b57d0] dark:fill-[#a8c7fa] animate-spin'
                                  width={24}
                                  height={24}
                                />
                              ) : (
                                <assets.GoogleBrand
                                  className=' w-[20px] h-[20px]'
                                  width={24}
                                  height={24}
                                />
                              )}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button>
                                  <assets.OptionIcon
                                    className='fill-[#1f1f1f]  w-[20px] h-[20px] dark:fill-white'
                                    width={24}
                                    height={24}
                                  />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className='px-4 py-4 border-none rounded-md flex flex-col gap-[10px] bg-[#e9eef6] dark:bg-[#444746] shadow-md'>
                                <DropdownMenuItem>
                                  <Button
                                    onClick={() =>
                                      handleCopyClick(message.text)
                                    }
                                    className='bg-transparent flex gap-x-4'
                                  >
                                    <assets.ContentCopyIcon
                                      className='fill-[#1f1f1f] w-[20px] h-[20px] dark:fill-white'
                                      width={24}
                                      height={24}
                                    />
                                    <span>Copy</span>
                                  </Button>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Button
                                    disabled
                                    className='bg-transparent flex gap-x-4'
                                  >
                                    <assets.Flag
                                      className='fill-[#1f1f1f]  w-[20px] h-[20px] dark:fill-white'
                                      width={24}
                                      height={24}
                                    />
                                    <span>Report legal issues</span>
                                  </Button>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {messageId === message.id && showGoogleSearches ? (
                            <PromptGoogleSearches
                              generatedPromptSearch={generatedPromptSearch}
                            />
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    </section>
                  </div>
                </div>
              ))}
              {status === "loading" && (
                <div className='flex flex-col md:flex-row items-start justify-start gap-4'>
                  <Image
                    src={assets.gemini_icon}
                    alt='gemini_icon'
                    className='w-8 h-8 md:w-9 md:h-9 spin_animation rounded-full mt-0 md:-mt-1'
                  />
                  <div className='flex items-start gap-5 md:gap-8 w-full md:w-auto'>
                    <div className='loading_div w-full md:w-[700px] flex flex-col gap-3 md:gap-4 mb-4 md:mb-6'>
                      <hr className='skeleton-loader w-full' />
                      <hr className='skeleton-loader w-full' />
                      <hr className='skeleton-loader w-3/4' />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        <div ref={messageContainerRef} className='mb-[1em]' />
      </div>
    </div>
  );
};

export default ChatResponse;
