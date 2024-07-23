import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const useDarkMode = () => {
  const { setTheme } = useTheme(); 
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setDarkMode(storedTheme === "dark");
    }
  }, []);

  const handleSetDarkMode = () => {
    setDarkMode(true);
    setTheme("dark");
    localStorage.setItem("theme", "dark");
  };

  const handleSetLightMode = () => {
    setDarkMode(false);
    setTheme("light");
    localStorage.setItem("theme", "light");
  };

  return {
    darkMode,
    handleSetDarkMode,
    handleSetLightMode,
  };
};

export default useDarkMode;
