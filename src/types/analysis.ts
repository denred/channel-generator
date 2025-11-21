import type { TopicWithNews } from "./news";
import type { ExtractTopicsResult } from "./openai";

export interface AnalysisStep {
  label: string;
  done: boolean;
}

export interface AnalyzeChannelResponse {
  channelId: string;
  lastVideos: Array<{
    videoId: string;
    title: string;
    thumbnail: string;
    publishedAt: string;
    description: string;
  }>;
  topics: ExtractTopicsResult;
  news: TopicWithNews[];
  reddit: unknown[];
  ideas: {
    title: string;
    thumb: string;
    idea: string;
  }[];
}
