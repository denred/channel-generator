export interface Topic {
  topic: string;
  confidence: number;
  relatedVideos: string[];
}

export interface ExtractTopicsResult {
  topics: Topic[];
}
