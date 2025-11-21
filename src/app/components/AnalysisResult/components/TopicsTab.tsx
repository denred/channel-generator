"use client";

import type { ExtractTopicsResult } from "@/types/openai";

interface TopicsTabProps {
  topics: ExtractTopicsResult;
}

const TopicsTab = ({ topics }: TopicsTabProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/60">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        <span className="text-2xl">🎯</span>
        Extracted Topics
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {topics.topics.map((topic, index) => (
          <div
            key={index}
            className="group ] rounded-lg border border-gray-200 bg-white/50 p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-blue-500/40"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400">
                {topic.topic}
              </h3>
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                {Math.round(topic.confidence * 100)}%
              </span>
            </div>

            {topic.relatedVideos.length > 0 && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
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
