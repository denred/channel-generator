export type RedditItem = {
  text: string;
  score: number;
  author: string;
  permalink: string;
  createdUtc: number;
};

export type TopicRedditData = {
  topic: string;
  comments: RedditItem[];
  posts: RedditItem[];
};

export interface RedditCommentRaw {
  body: string;
  score: number;
  author: string;
  permalink?: string;
  created_utc: number;
}

export interface RedditPostRaw {
  title: string;
  score: number;
  author: string;
  full_link?: string;
  permalink?: string;
  created_utc: number;
}
