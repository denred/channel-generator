"use client";

import clsx from "clsx";
import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

import { ThemeMode } from "@/libs/enums/themeMode";
import { THEME_STORAGE_KEY } from "@/utils/theme";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.LIGHT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark && theme === ThemeMode.LIGHT) {
      setTheme(ThemeMode.DARK);
    }
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", theme === ThemeMode.DARK);
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    const next = theme === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
    setTheme(next);
  };

  if (!mounted) {
    return <div className="h-7 w-12" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className={clsx(
        "relative flex h-7 w-12 cursor-pointer items-center rounded-full border backdrop-blur-sm transition-all duration-200",
        "border-gray-300 bg-gray-100 hover:bg-gray-200",
        "dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800",
      )}
    >
      <div
        className={clsx(
          "absolute h-5 w-5 rounded-full shadow transition-transform duration-200",
          "bg-white dark:bg-gray-700",
          theme === ThemeMode.DARK ? "translate-x-6" : "translate-x-1",
        )}
      />

      <FiSun
        className={clsx(
          "absolute left-1 text-[14px] text-gray-500 transition-opacity duration-200",
          theme === ThemeMode.LIGHT ? "opacity-100" : "opacity-0",
        )}
      />

      <FiMoon
        className={clsx(
          "absolute right-1 text-[14px] text-gray-400 transition-opacity duration-200",
          theme === ThemeMode.DARK ? "opacity-100" : "opacity-0",
        )}
      />
    </button>
  );
};

export default ThemeToggle;
