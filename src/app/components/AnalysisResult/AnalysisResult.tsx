"use client";

import { useState } from "react";

import type { AnalyzeChannelResponse } from "@/types/analysis";

type TabType = "ideas" | "topics" | "news" | "reddit" | "videos";

export default function AnalysisResult({ data }: { data: AnalyzeChannelResponse }) {
  const [activeTab, setActiveTab] = useState<TabType>("ideas");

  const tabs: Array<{ id: TabType; label: string; icon: string; count?: number }> = [
    { id: "ideas", label: "Video Ideas", icon: "💡", count: data.ideas?.length },
    { id: "topics", label: "Topics", icon: "🎯", count: data.topics?.topics?.length },
    { id: "news", label: "News", icon: "📰", count: data.news?.length },
    { id: "reddit", label: "Reddit", icon: "💬", count: data.reddit?.length },
    { id: "videos", label: "Videos", icon: "🎬", count: data.lastVideos?.length },
  ];

  return (
    <section className="mt-8 space-y-6">
      {/* Navigation Tabs */}
      <div className="sticky top-0 z-10 rounded-xl bg-white p-2 shadow-lg">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    activeTab === tab.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Video Ideas Section */}
      {activeTab === "ideas" && (
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800">
            <span className="text-2xl">💡</span>
            Video Ideas for Your Channel
          </h2>
          <div className="space-y-6">
            {data.ideas && data.ideas.length > 0 ? (
              data.ideas.map((idea, index) => (
                <div
                  key={index}
                  className="rounded-xl border-2 border-purple-200 bg-linear-to-br from-purple-50 to-pink-50 p-6 transition-all hover:border-purple-400 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="flex-1 text-xl font-bold text-purple-900">{idea.title}</h3>
                    <span className="rounded-full bg-purple-600 px-3 py-1 text-sm font-medium text-white">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="mb-4 rounded-lg bg-white/70 p-4">
                    <h4 className="mb-2 text-sm font-semibold text-gray-700">💭 Concept</h4>
                    <p className="text-gray-800">{idea.concept}</p>
                  </div>
                  <div className="rounded-lg bg-white/70 p-4">
                    <h4 className="mb-2 text-sm font-semibold text-gray-700">
                      🎨 Thumbnail Design
                    </h4>
                    <p className="text-gray-800">{idea.thumbnail}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-gray-500">No video ideas generated yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Topics Section */}
      {activeTab === "topics" && (
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
      )}

      {/* News Section */}
      {activeTab === "news" && (
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-800">
            <span className="text-2xl">📰</span>
            Relevant News
          </h2>
          {data.news && data.news.length > 0 ? (
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
                        <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                          {article.description}
                        </p>
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
          ) : (
            <p className="py-8 text-center text-gray-500">No news articles found.</p>
          )}
        </div>
      )}

      {/* Reddit Section */}
      {activeTab === "reddit" && (
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
      )}

      {/* Videos Section */}
      {activeTab === "videos" && (
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
      )}

      {/* Channel ID - Always visible */}
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
