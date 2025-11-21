"use client";

import type { TopicRedditData } from "@/types/reddit";

interface RedditTabProps {
  reddit: TopicRedditData[];
}

export default function RedditTab({ reddit }: RedditTabProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/60">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        <span className="text-2xl">💬</span>
        Reddit Discussions
      </h2>

      <div className="space-y-7">
        {reddit.map((topicData, topicIndex) => (
          <section key={topicIndex} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {topicData.topic}
            </h3>

            {topicData.posts.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {topicData.posts.map((post, postIndex) => (
                  <a
                    key={postIndex}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-lg border border-gray-200 bg-white/50 p-4 shadow-sm transition-all hover:border-orange-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-orange-500/40"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="line-clamp-3 text-sm font-medium text-gray-900 transition-colors group-hover:text-orange-600 dark:text-gray-100 dark:group-hover:text-orange-400">
                        {post.text}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
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
              <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No Reddit discussions found for this topic
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
