import type { TopicWithNews } from "./news";
import type { ExtractTopicsResult } from "./openai";
import type { TopicRedditData } from "./reddit";
import type { VideoIdea } from "./videoIdea";

export interface AnalysisStep {
  label: string;
  done: boolean;
}

export interface AnalyzeChannelResponse {
  status: number;
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
  reddit: TopicRedditData[];
  ideas: VideoIdea[];
}
