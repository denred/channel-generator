export type RedditItem = {
  text: string;
  score: number;
  author: string;
  permalink: string;
  createdUtc: number;
  subreddit?: string;
};

export type TopicRedditData = {
  topic: string;
  posts: RedditItem[];
};

export interface RedditPostData {
  title: string;
  selftext?: string;
  score: number;
  author: string;
  permalink: string;
  created_utc: number;
  subreddit: string;
  num_comments: number;
}

export interface RedditChild {
  kind: string;
  data: RedditPostData;
}

export interface RedditSearchResponse {
  kind: string;
  data: {
    children: RedditChild[];
    after: string | null;
    before: string | null;
  };
}
