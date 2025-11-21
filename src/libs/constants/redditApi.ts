export const REDDIT_BASE_URLS = [
  "https://www.reddit.com",
  "https://old.reddit.com",
  "https://api.reddit.com",
] as const;

export const REDDIT_BASE_URL = REDDIT_BASE_URLS[0];

export const REDDIT_ENDPOINTS = {
  SEARCH: `${REDDIT_BASE_URL}/search.json`,
} as const;

export const REDDIT_PARAMS = {
  LIMIT: 10,
  SORT: "relevance",
  TIME: "month",
  RAW_JSON: 1,
} as const;
