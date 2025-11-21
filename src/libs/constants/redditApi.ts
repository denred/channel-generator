export const REDDIT_BASE_URL = "https://www.reddit.com";

export const REDDIT_ENDPOINTS = {
  SEARCH: `${REDDIT_BASE_URL}/search.json`,
} as const;

export const REDDIT_PARAMS = {
  LIMIT: 10,
  SORT: "relevance",
  TIME: "month",
} as const;
