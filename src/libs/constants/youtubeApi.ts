export const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

export const YOUTUBE_API_ENDPOINTS = {
  CHANNELS: "/channels",
  SEARCH: "/search",
  VIDEOS: "/videos",
} as const;

export const YOUTUBE_API_PARTS = {
  ID: "id",
  SNIPPET: "snippet",
} as const;

export const YOUTUBE_API_PARAMS = {
  ORDER_DATE: "date",
  TYPE_VIDEO: "video",
  TYPE_CHANNEL: "channel",
  MAX_RESULTS_10: "10",
  MAX_RESULTS_50: "50",
} as const;
