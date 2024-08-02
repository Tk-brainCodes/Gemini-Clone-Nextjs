"use client"

import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { assets } from "@/assets";
import Link from "next/link";

const ChatOptionsDropdown = ({
  loadingDelete,
  handleDelete,
  children,
}: {
  loadingDelete: boolean;
  handleDelete: any;
  children: ReactNode;
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          side='right'
          className='w-[150px] h-[128.667px] shadow-[20px] border-none border-0 bg-[#e9eef6] dark:bg-[#444746]'
        >
          <Button className='flex gap-x-3 bg-transparent'>
            <assets.Pin className='fill-black dark:fill-white' />
            <span>Pin</span>
          </Button>
          <Button className='flex gap-x-3 bg-transparent'>
            <assets.EditIcon className='fill-black dark:fill-white' />
            <span>Rename</span>
          </Button>
          <DropdownMenuSeparator className='bg-[#444746]' />
          <Dialog>
            <DialogTrigger asChild>
              <Button className='flex gap-x-3 background-transparent'>
                <assets.Delete className='fill-black dark:fill-white' />
                <span>Delete</span>
              </Button>
            </DialogTrigger>
            <DialogContent className=' dark:bg-[#202124] rounded-md bg-white shadow-md border-0 w-[600px]'>
              <DialogHeader>
                <DialogTitle className='dark:text-white text-[#1f1f1f] mb-[1.5em]'>
                  Delete chat?
                </DialogTitle>
                <DialogDescription className='dark:text-[#c4c7c5] text-[#444746] flex flex-col gap-x-4'>
                  You&apos;ll no longer see this chat here. This will also
                  delete related activity like prompts, responses, and feedback
                  from your Gemini Apps Activity.
                  <Link href='#' className='mt-4 text-[#a8c7fa] underline'>
                    Learn more
                  </Link>
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className='flex w-full items-center justify-end gap-x-6'>
                <Button className='text-[#8ab4f8] hover:text-[#aecbfa] px-2 py-2 hover:bg-[#131314]'>
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className='text-[#8ab4f8] hover:text-[#aecbfa] px-2 py-2 hover:bg-[#131314]'
                  disabled={loadingDelete}
                >
                  {loadingDelete ? (
                    <span className='flex gap-x-3'>
                      <assets.ProgressActivityIcon className='fill-blue-300 dark:fill-white animate-spin' />
                      Deleting...
                    </span>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ChatOptionsDropdown;
