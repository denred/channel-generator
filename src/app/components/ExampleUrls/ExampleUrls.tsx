"use client";

import { useState } from "react";
import { FiCopy, FiCheck, FiArrowRight } from "react-icons/fi";

import { copyToClipboard } from "@/utils/copyToClipboard";

interface ExampleItem {
  name: string;
  url: string;
}

interface Props {
  onSelectUrl: (url: string) => void;
}

const EXAMPLE_URLS: ExampleItem[] = [
  { name: "MKBHD", url: "https://www.youtube.com/@MarquesBrownlee" },
  { name: "Fireship", url: "https://www.youtube.com/@Fireship" },
  { name: "Veritasium", url: "https://www.youtube.com/@veritasium" },
  { name: "ThePrimeagen", url: "https://www.youtube.com/@ThePrimeagen" },
];

const ExampleUrls = ({ onSelectUrl }: Props) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (url: string) => {
    const success = await copyToClipboard(url);

    if (success) {
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 md:rounded-xl md:border md:p-4 dark:border-gray-700 dark:bg-gray-800/40">
      <header className="mb-3 flex items-center gap-2">
        <span className="text-lg md:text-xl">💡</span>
        <h3 className="text-xs font-semibold text-gray-700 md:text-sm dark:text-gray-200">
          Try these examples:
        </h3>
      </header>

      <div className="grid gap-2 sm:grid-cols-2">
        {EXAMPLE_URLS.map(({ name, url }) => {
          const isCopied = copied === url;

          return (
            <article
              key={url}
              className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-2.5 transition-all hover:border-blue-300 hover:shadow-md md:p-3 dark:border-gray-700 dark:bg-gray-900"
            >
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-xs font-medium text-gray-900 md:mb-1 md:text-sm dark:text-gray-100">
                  {name}
                </p>
                <p className="truncate text-[10px] text-gray-500 md:text-xs dark:text-gray-400">
                  {url}
                </p>
              </div>

              <div className="ml-2 flex gap-1.5 md:gap-2">
                <button
                  onClick={() => void handleCopy(url)}
                  className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 md:p-2 dark:hover:bg-gray-800"
                  title="Copy URL"
                >
                  {isCopied ? (
                    <FiCheck size={16} className="text-green-500 md:h-5 md:w-5" />
                  ) : (
                    <FiCopy size={16} className="md:h-5 md:w-5" />
                  )}
                </button>

                <button
                  onClick={() => onSelectUrl(url)}
                  className="cursor-pointer rounded-md bg-blue-600 p-1.5 text-white transition-colors hover:bg-blue-700 md:p-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                  title="Use this URL"
                >
                  <FiArrowRight size={14} className="md:h-4 md:w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ExampleUrls;
