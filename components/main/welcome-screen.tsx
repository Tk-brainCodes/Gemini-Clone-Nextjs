import Image from "next/image";
import { static_data } from "@/lib/static-data";

type Props = {};

const WelcomeScreen = (props: Props) => {
  return (
    <div className='w-fit h-fit flex flex-col'>
      <span className='font-semibold -mt-[3em]'>
        <p className='gradient-text text-[56px] leading-[64px] text-[#c4c7c5]'>
          Hello, Eboreime
        </p>
        <p className='text-[#c4c7c5] text-[56px] leading-[64px]'>
          How can I help you today?
        </p>
      </span>
      <div className='flex items-center justify-start gap-x-3 mt-[7em] mb-[3em]'>
        {static_data.map(({ prompt, icon }) => (
          <div
            key={prompt}
            className='h-[210px] w-[230px] p-[15px] bg-[#f0f4f9] rounded-[13px] relative cursor-pointer hover:bg-[#dfe4ed]'
          >
            <p className='prompt-text-content text-[#1F1F1F] text-[16px] flex flex-col items-start'>
              {prompt}
            </p>
            <span className='w-[40px] h-[40px] p-[5px] bg-white rounded-full flex items-center justify-center right-[10px] bottom-[10px] absolute'>
              <Image src={icon} alt={`${icon}`} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
