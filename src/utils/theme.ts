import { ThemeMode } from "@/libs/enums/themeMode";

export const THEME_STORAGE_KEY = "theme";

export const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;

  if (saved) {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? ThemeMode.DARK
    : ThemeMode.LIGHT;
};
