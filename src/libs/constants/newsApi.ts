export const NEWSAPI_BASE_URL = "https://newsapi.org/v2";

export const NEWSAPI_ENDPOINTS = {
  EVERYTHING: "/everything",
  TOP_HEADLINES: "/top-headlines",
} as const;

export const NEWSAPI_PARAMS = {
  LANG_EN: "en",
  SORT_BY_PUBLISHED_AT: "publishedAt",
  SORT_BY_RELEVANCY: "relevancy",
  SORT_BY_POPULARITY: "popularity",
  PAGE_SIZE_5: "5",
  PAGE_SIZE_10: "10",
} as const;
