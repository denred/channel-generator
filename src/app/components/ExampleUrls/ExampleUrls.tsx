"use client";

import { useState } from "react";

const EXAMPLE_URLS = [
  { name: "MKBHD", url: "https://www.youtube.com/@MarquesBrownlee" },
  { name: "Fireship", url: "https://www.youtube.com/@Fireship" },
  { name: "Veritasium", url: "https://www.youtube.com/@veritasium" },
  { name: "ThePrimeagen", url: "https://www.youtube.com/@ThePrimeagen" },
];

export default function ExampleUrls({ onSelectUrl }: { onSelectUrl: (url: string) => void }) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopy = (url: string) => {
    void navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">💡</span>
        <h3 className="text-sm font-semibold text-gray-700">Try these examples:</h3>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {EXAMPLE_URLS.map((example) => (
          <div
            key={example.url}
            className="group relative flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex-1">
              <p className="mb-1 text-sm font-medium text-gray-900">{example.name}</p>
              <p className="truncate text-xs text-gray-500">{example.url}</p>
            </div>
            <div className="ml-2 flex gap-1">
              <button
                onClick={() => handleCopy(example.url)}
                className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                title="Copy URL"
              >
                {copiedUrl === example.url ? (
                  <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={() => onSelectUrl(example.url)}
                className="rounded-md bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700"
                title="Use this URL"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
