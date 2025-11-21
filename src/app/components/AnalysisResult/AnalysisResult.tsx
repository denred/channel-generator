import type { AnalyzeChannelResponse } from "@/types/analysis";

export default function AnalysisResult({ data }: { data: AnalyzeChannelResponse }) {
  return (
    <section className="mt-8 space-y-6">
      {/* Topics Section */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-800">
          <span className="text-2xl">🎯</span>
          Extracted Topics
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.topics.topics.map((topic, index) => (
            <div
              key={index}
              className="rounded-lg border border-blue-200 bg-blue-50 p-4 transition-all hover:border-blue-400 hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-blue-900">{topic.topic}</h3>
                <span className="rounded-full bg-blue-200 px-2 py-1 text-xs font-medium text-blue-800">
                  {Math.round(topic.confidence * 100)}%
                </span>
              </div>
              {topic.relatedVideos.length > 0 && (
                <p className="text-sm text-blue-700">
                  Related videos: {topic.relatedVideos.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* News Section */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-800">
          <span className="text-2xl">📰</span>
          Relevant News
        </h2>
        <div className="space-y-6">
          {data.news.map((topicNews, topicIndex) => (
            <div key={topicIndex} className="space-y-3">
              <h3 className="border-l-4 border-green-500 pl-3 text-lg font-semibold text-gray-800">
                {topicNews.topic}
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {topicNews.news.slice(0, 6).map((article, articleIndex) => (
                  <a
                    key={articleIndex}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:border-green-400 hover:shadow-md"
                  >
                    <h4 className="mb-2 line-clamp-2 font-medium text-gray-900 group-hover:text-green-600">
                      {article.title}
                    </h4>
                    <p className="mb-2 line-clamp-2 text-sm text-gray-600">{article.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-medium">{article.source}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reddit Section */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-800">
          <span className="text-2xl">💬</span>
          Reddit Discussions
        </h2>
        <div className="space-y-6">
          {data.reddit.map((topicData, topicIndex) => (
            <div key={topicIndex} className="space-y-3">
              <h3 className="border-l-4 border-orange-500 pl-3 text-lg font-semibold text-gray-800">
                {topicData.topic}
              </h3>

              {/* Posts */}
              {topicData.posts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Top Posts</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {topicData.posts.slice(0, 4).map((post, postIndex) => (
                      <a
                        key={postIndex}
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-lg border border-gray-200 bg-orange-50 p-3 transition-all hover:border-orange-400 hover:shadow-md"
                      >
                        <p className="mb-2 line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-orange-600">
                          {post.text}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>u/{post.author}</span>
                          <span className="font-medium text-orange-600">↑ {post.score}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              {topicData.comments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-600">Top Comments</h4>
                  <div className="grid gap-2">
                    {topicData.comments.slice(0, 3).map((comment, commentIndex) => (
                      <a
                        key={commentIndex}
                        href={comment.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-orange-300 hover:bg-orange-50"
                      >
                        <p className="mb-1 line-clamp-2 text-sm text-gray-700">{comment.text}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>u/{comment.author}</span>
                          <span className="font-medium">↑ {comment.score}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {topicData.posts.length === 0 && topicData.comments.length === 0 && (
                <p className="py-4 text-center text-sm text-gray-500">
                  No Reddit discussions found for this topic
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Videos Section */}
      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-800">
          <span className="text-2xl">🎬</span>
          Latest Videos ({data.lastVideos.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.lastVideos.map((video) => (
            <a
              key={video.videoId}
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-lg border border-gray-200 bg-gray-50 transition-all hover:border-red-400 hover:shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h4 className="mb-1 line-clamp-2 font-medium text-gray-900 group-hover:text-red-600">
                  {video.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Channel ID */}
      <div className="rounded-xl bg-linear-to-r from-purple-50 to-pink-50 p-4 shadow">
        <p className="text-center text-sm text-gray-600">
          Channel ID:{" "}
          <a
            href={`https://www.youtube.com/channel/${data.channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono font-semibold text-purple-600 hover:underline"
          >
            {data.channelId}
          </a>
        </p>
      </div>
    </section>
  );
}
