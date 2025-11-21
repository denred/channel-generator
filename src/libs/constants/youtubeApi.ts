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
