"use client";

import { useEffect, useState } from "react";
import { assets } from "@/assets";
import Image from "next/image";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col items-center justify-center'>
      {loading && (
        <Image
          src={assets.ChatLoadingAnimation}
          alt='discord-animation-display'
          className=''
        />
      )}
    </div>
  );
};

export default LoadingScreen;
