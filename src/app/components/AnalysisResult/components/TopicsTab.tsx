"use client";

import type { ExtractTopicsResult } from "@/types/openai";

interface TopicsTabProps {
  topics: ExtractTopicsResult;
}

const TopicsTab = ({ topics }: TopicsTabProps) => {
  return (
    <div className="rounded-none border-0 bg-transparent p-4 md:rounded-xl md:border md:border-gray-200 md:bg-white/70 md:p-6 md:shadow-sm md:backdrop-blur-sm md:dark:border-gray-700 md:dark:bg-gray-800/60">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 md:mb-6 md:text-2xl dark:text-gray-100">
        <span className="text-xl md:text-2xl">🎯</span>
        Extracted Topics
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
        {topics.topics.map((topic, index) => (
          <div
            key={index}
            className="group rounded-lg border border-gray-200 bg-white/50 p-3 shadow-sm transition-all hover:border-blue-400 hover:shadow-md md:p-4 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-blue-500/40"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600 md:text-base dark:text-gray-200 dark:group-hover:text-blue-400">
                {topic.topic}
              </h3>
              <span className="shrink-0 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {Math.round(topic.confidence * 100)}%
              </span>
            </div>

            {topic.relatedVideos.length > 0 && (
              <p className="text-xs text-gray-700 md:text-sm dark:text-gray-300">
                <span className="font-medium text-gray-800 dark:text-gray-200">Related:</span>{" "}
                {topic.relatedVideos.join(", ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicsTab;
