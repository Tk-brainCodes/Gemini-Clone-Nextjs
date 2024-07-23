import { ReactNode, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentSession } from "@/redux/conversationSlice";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { toast } from "sonner";
import { assets } from "@/assets";
import Link from "next/link";
import axios from "axios";

const ChatOptionsDropdown = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const currentSession = useAppSelector(selectCurrentSession);

  const handleDeleteChatSessions = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/delete-chat/${currentSession?.id}`);
      toast("Chat Deleted Successfully");
      router.push("/new-chat");
    } catch (error) {
      console.log("[DELETE_ERROR]", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          side='right'
          className='w-[150px] h-[128.667px] shadow-[20px] border-none border-0 bg-[#e9eef6] dark:bg-[#444746]'
        >
          <DropdownMenuItem className='flex gap-x-3'>
            <assets.Pin className='fill-black dark:fill-white' />
            <span>Pin</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='flex gap-x-3'>
            <assets.EditIcon className='fill-black dark:fill-white' />
            <span>Rename</span>
          </DropdownMenuItem>
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
                  onClick={handleDeleteChatSessions}
                  className='text-[#8ab4f8] hover:text-[#aecbfa] px-2 py-2 hover:bg-[#131314]'
                  disabled={loading}
                >
                  {loading ? (
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
