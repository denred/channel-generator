"use client";

import type { TopicRedditData } from "@/types/reddit";

interface RedditTabProps {
  reddit: TopicRedditData[];
}

export default function RedditTab({ reddit }: RedditTabProps) {
  return (
    <div className="rounded-none border-0 bg-transparent p-4 md:rounded-xl md:border md:border-gray-200 md:bg-white/70 md:p-6 md:shadow-sm md:backdrop-blur-sm md:dark:border-gray-700 md:dark:bg-gray-800/60">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900 md:mb-6 md:text-2xl dark:text-gray-100">
        <span className="text-xl md:text-2xl">💬</span>
        Reddit Discussions
      </h2>

      <div className="space-y-5 md:space-y-7">
        {reddit.map((topicData, topicIndex) => (
          <section key={topicIndex} className="space-y-2 md:space-y-3">
            <h3 className="text-base font-semibold text-gray-800 md:text-lg dark:text-gray-200">
              {topicData.topic}
            </h3>

            {topicData.posts.length > 0 ? (
              <div className="grid gap-2.5 sm:grid-cols-2 md:gap-3">
                {topicData.posts.map((post, postIndex) => (
                  <a
                    key={postIndex}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-lg border border-gray-200 bg-white/50 p-3 shadow-sm transition-all hover:border-orange-400 hover:shadow-md md:p-4 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-orange-500/40"
                  >
                    <div className="mb-1.5 flex items-start justify-between gap-2 md:mb-2">
                      <p className="line-clamp-3 text-xs font-medium text-gray-900 transition-colors group-hover:text-orange-600 md:text-sm dark:text-gray-100 dark:group-hover:text-orange-400">
                        {post.text}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[10px] text-gray-500 md:text-xs dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <span>u/{post.author}</span>
                        {post.subreddit && (
                          <span className="text-orange-600 dark:text-orange-400">
                            r/{post.subreddit}
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        ↑ {post.score}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-xs text-gray-500 md:text-sm dark:text-gray-400">
                No Reddit discussions found for this topic.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
