"use client";

import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

import { ThemeMode } from "@/libs/enums/themeMode";
import { getInitialTheme, THEME_STORAGE_KEY } from "@/utils/theme";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === ThemeMode.DARK);
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
    setTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="relative flex h-7 w-12 cursor-pointer items-center rounded-full border border-gray-300 bg-gray-100 backdrop-blur-sm transition-all duration-200 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
    >
      <div
        className={`absolute h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 dark:bg-gray-700 ${theme === ThemeMode.DARK ? "translate-x-6" : "translate-x-1"} `}
      />

      <FiSun
        className={`absolute left-1 text-[14px] text-gray-500 transition-opacity duration-200 ${theme === ThemeMode.LIGHT ? "opacity-100" : "opacity-0"} `}
      />
      <FiMoon
        className={`absolute right-1 text-[14px] text-gray-400 transition-opacity duration-200 ${theme === ThemeMode.DARK ? "opacity-100" : "opacity-0"} `}
      />
    </button>
  );
};

export default ThemeToggle;
