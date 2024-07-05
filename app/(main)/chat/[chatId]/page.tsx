"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectCurrentSession,
  selectStatus,
  selectError,
  fetchChatsSession,
  saveChatSession,
  selectSessions,
} from "@/redux/conversationSlice";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { assets } from "@/assets";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

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

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatSession {
  id: string;
  messages: Message[];
}

const ChatResponse = () => {
  const currentSession = useAppSelector(selectCurrentSession);
  const sessions: ChatSession[] = useAppSelector(selectSessions);
  const status: "idle" | "loading" | "succeeded" | "failed" =
    useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();
  const currentSessionId = currentSession?.id;

  useEffect(() => {
    dispatch(fetchChatsSession());

    if (currentSessionId) {
      dispatch(saveChatSession());
    }
  }, [currentSessionId, dispatch]);

  if (error) {
    return <div>Something went wrong {error}</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Toaster position='bottom-left' />
      <div className='result w-[712px] mt-[2em]'>
        {sessions
          .filter((curSession) => curSession.id !== currentSession?.id)
          .map((session) => (
            <div key={session.id}>
              {session.messages.map((message, index) => (
                <div
                  key={index}
                  className={`my-10 w-full ${
                    message.sender === "ai" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className='markdown-content w-[712px] flex flex-col items-start justify-start gap-[22px] text-[17px] font-normal text-base leading-[1.7] text-[#1f1f1f] group'>
                    <div className='flex items-center w-full group gap-[20px]'>
                      {message.sender == "user" ? (
                        <Image
                          src={assets.user_icon}
                          alt='gemini_icon'
                          className='w-[38px] h-[38px] mt-[0.7em] cursor-pointer rounded-full'
                        />
                      ) : (
                        ""
                      )}

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
                      {message.sender == "ai" ? (
                        <Image
                          src={assets.gemini_icon}
                          alt='gemini_icon'
                          className='w-[34px] h-[34px] cursor-pointer rounded-full -mt-[0.4em] '
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

                    {message.sender === "user" && (
                      <div className='w-full flex items-end justify-end gap-x-2 '>
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
    </div>
  );
};

export default ChatResponse;
