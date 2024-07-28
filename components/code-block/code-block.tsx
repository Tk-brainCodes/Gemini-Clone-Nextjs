import { assets } from "@/assets";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atelierForestDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CodeBlock = ({
  language,
  value,
  theme,
}: {
  language: string;
  value: string;
  theme: string;
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
    backgroundColor: theme === "light" ? "#f0f4f9" : "#1e1f20",
    borderRadius: "12px 12px 0px 0px",
  };

  return (
    <div className=''>
      <SyntaxHighlighter
        style={atelierForestDark}
        language={language}
        customStyle={customStyles}
        PreTag='div'
        wrapLines={true}
      >
        {value}
      </SyntaxHighlighter>
      <div
        className={cn(
          "copy_content w-full mt-1 px-4 py-4 h-[40px] flex items-center justify-between",
          theme === "light" ? "bg-[#f0f4f9]" : "bg-[#1e1f20]"
        )}
      >
        <div className='leading-[16px] text-[16px] font-normal flex text-[#444746] dark:text-white gap-x-2'>
          Use code
          <a className='text-underline text-[#0b57d0] cursor-pointer'>
            with caution
          </a>
        </div>
        <assets.ContentCopyIcon
          onClick={handleCopyClick}
          className='cursor-pointer fill-[#1f1f1f] dark:fill-white'
          width={24}
          height={24}
        />
      </div>
    </div>
  );
};

export default CodeBlock;
