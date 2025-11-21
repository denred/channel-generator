export type NewsItem = {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
};

export type TopicWithNews = {
  topic: string;
  news: NewsItem[];
};
