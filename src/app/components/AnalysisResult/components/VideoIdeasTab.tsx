"use client";

import type { VideoIdea } from "@/types/videoIdea";

interface VideoIdeasTabProps {
  ideas: VideoIdea[] | undefined;
}

const VideoIdeasTab = ({ ideas }: VideoIdeasTabProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/60">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        <span className="text-2xl">💡</span>
        Video Ideas
      </h2>

      {ideas && ideas.length > 0 ? (
        <div className="space-y-5">
          {ideas.map((idea, index) => (
            <div
              key={index}
              className="group rounded-lg border border-gray-200 bg-white/50 p-5 shadow transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-blue-500/40"
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="flex-1 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400">
                  {idea.title}
                </h3>
                <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-blue-500">
                  #{index + 1}
                </span>
              </div>

              <div className="mb-4 rounded-md border-gray-200 bg-white/70 p-4 text-sm dark:border-gray-700 dark:bg-gray-900/50">
                <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">💭 Concept</p>
                <p className="text-gray-800 dark:text-gray-300">{idea.concept}</p>
              </div>

              <div className="rounded-md border-gray-200 bg-white/70 p-4 text-sm dark:border-gray-700 dark:bg-gray-900/50">
                <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">
                  🎨 Thumbnail Design
                </p>
                <p className="text-gray-800 dark:text-gray-300">{idea.thumbnail}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-gray-500 dark:text-gray-400">
          No video ideas generated yet.
        </p>
      )}
    </div>
  );
};

export default VideoIdeasTab;
