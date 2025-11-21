"use client";

import type { TopicWithNews } from "@/types/news";

interface NewsTabProps {
  news: TopicWithNews[] | undefined;
}

const NewsTab = ({ news }: NewsTabProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/60">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
        <span className="text-2xl">📰</span>
        Relevant News
      </h2>

      {news && news.length > 0 ? (
        <div className="space-y-7">
          {news.map((topicNews, topicIndex) => (
            <section key={topicIndex} className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {topicNews.topic}
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topicNews.news.slice(0, 6).map((article, articleIndex) => (
                  <a
                    key={articleIndex}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-lg border border-gray-200 bg-white/50 p-4 shadow-sm transition-all hover:border-green-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-green-500/40"
                  >
                    <h4 className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 transition-colors group-hover:text-green-600 dark:text-gray-100 dark:group-hover:text-green-400">
                      {article.title}
                    </h4>

                    <p className="mb-2 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{article.source}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-gray-500 dark:text-gray-400">No news articles found.</p>
      )}
    </div>
  );
};

export default NewsTab;
