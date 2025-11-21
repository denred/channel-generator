export interface AnalysisStep {
  label: string;
  done: boolean;
}

export interface AnalyzeChannelResponse {
  topics: string[];
  news: unknown[];
  reddit: unknown[];
  ideas: {
    title: string;
    thumb: string;
    idea: string;
  }[];
}
