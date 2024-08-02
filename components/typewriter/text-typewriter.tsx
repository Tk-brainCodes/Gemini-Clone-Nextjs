"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TextTypewriter = (text: string) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDisplayText(text.slice(0, displayText.length + 1));
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [displayText, text]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
    </motion.span>
  );
};

export default TextTypewriter;
