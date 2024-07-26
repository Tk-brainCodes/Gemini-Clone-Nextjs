"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='bg-slate-800 w-full h-full items-center justify-center flex flex-col'>
      <h2 className='text-2xl'>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
