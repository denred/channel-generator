import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

import ThemeToggle from "@/app/components/ThemeToggle/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Channel Analyzer",
  description: "AI-powered YouTube channel analyzer",
};

const setTheme = `
  (function () {
    try {
      const saved = localStorage.getItem('theme');
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const theme = saved || system;
      document.documentElement.dataset.theme = theme;
    } catch(e) {}
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setTheme }} />
      </head>

      <body
        className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100`}
      >
        <header className="border-b border-gray-200 bg-white/60 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
          <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-6">
            <h1 className="text-lg font-semibold tracking-tight">Channel Analyzer</h1>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto w-full max-w-4xl px-6 py-10">{children}</main>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
