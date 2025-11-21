export const GNEWS_API_BASE_URL = "https://gnews.io/api/v4";

export const GNEWS_API_ENDPOINTS = {
  SEARCH: "/search",
  TOP_HEADLINES: "/top-headlines",
} as const;

export const GNEWS_API_PARAMS = {
  LANG_EN: "en",
  MAX_5: "5",
  MAX_10: "10",
} as const;
