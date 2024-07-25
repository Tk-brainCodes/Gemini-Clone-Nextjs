"use client"

import Link from "next/link";
import { assets } from "@/assets";

const PromptGoogleSearches = ({
  generatedPromptSearch,
}: {
  generatedPromptSearch: string[];
}) => {
  return (
    <>
      <div className='px-6 py-2 bg-[#f8fafd] mt-[1em] w-full rounded-[20px] dark:bg-[#1b1b1b]'>
        <h2 className='text-[#1f1f1f] dark:text-white mb-[1em]'>Search related topics</h2>
        <ul className='flex flex-col p-4'>
          {generatedPromptSearch.map((result: string, index) => (
            <span className='flex gap-x-3 items-center justify-start px-2 py-2  hover:bg-[#f8fafd] hover:dark:bg-[#444746] ' key={index}>
              <assets.Search
                className='fill-[#0b57d0] dark:fill-[#a8c7fa]'
                width={24}
                height={24}
              />
              <Link
                href={`https://www.google.com/search?q=${result.trim()}`}
                target='_blank'
                className='no-underline text-[#0b57d0] dark:text-[#a8c7fa] w-full'
                style={{textDecoration: "none"}}
              >
                {result.trim()}
              </Link>
            </span>
          )).filter((prompt) => prompt !== null)}
        </ul>
      </div>
    </>
  );
};

export default PromptGoogleSearches;
