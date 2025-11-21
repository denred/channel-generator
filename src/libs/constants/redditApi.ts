export const REDDIT_BASE_URL = "https://api.pushshift.io/reddit/search";

export const REDDIT_ENDPOINTS = {
  COMMENT: `${REDDIT_BASE_URL}/comment/`,
  SUBMISSION: `${REDDIT_BASE_URL}/submission/`,
} as const;

export const REDDIT_PARAMS = {
  SIZE: 5,
  SORT: "desc",
  SORT_TYPE: "score",
} as const;
