"use client";

import Image from "next/image";
import Link from "next/link";

import type { AnalyzeChannelResponse } from "@/types/analysis";

interface VideosTabProps {
  videos: AnalyzeChannelResponse["lastVideos"];
}

const VideosTab = ({ videos }: VideosTabProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/60">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        <span className="text-2xl">🎬</span>
        Latest Videos
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-sm font-medium text-red-600 dark:bg-red-900/40 dark:text-red-300">
          {videos.length}
        </span>
      </h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Link
            key={video.videoId}
            href={`https://www.youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white/60 shadow-sm transition-all hover:border-red-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-red-500/40"
          >
            <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
              />
            </div>

            <div className="p-4">
              <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-red-600 dark:text-gray-100 dark:group-hover:text-red-400">
                {video.title}
              </h4>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {new Date(video.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideosTab;
