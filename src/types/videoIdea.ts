import type { TopicWithNews } from "./news";
import type { ExtractTopicsResult } from "./openai";
import type { TopicRedditData } from "./reddit";

export type VideoIdea = {
  title: string;
  thumbnail: string;
  concept: string;
};

export type GenerateVideoIdeasInput = {
  topics: ExtractTopicsResult["topics"];
  news: TopicWithNews[];
  reddit: TopicRedditData[];
  recentVideoTitles: string[];
};
