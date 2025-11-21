import { REDDIT_ENDPOINTS, REDDIT_PARAMS } from "@/libs/constants/redditApi";
import type { RedditItem, RedditPostData, TopicRedditData } from "@/types/reddit";
import { logger } from "@/utils/logger";

import { redditApiRequest } from "./redditApiUtils";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mapPostToRedditItem = (post: RedditPostData): RedditItem => ({
  text: post.title + (post.selftext ? `\n${post.selftext.substring(0, 200)}` : ""),
  score: post.score,
  author: post.author,
  permalink: `https://www.reddit.com${post.permalink}`,
  createdUtc: post.created_utc,
  subreddit: post.subreddit,
});

export const searchRedditDiscussions = async (topics: string[]): Promise<TopicRedditData[]> => {
  logger.info({ topicsCount: topics.length }, "Searching Reddit discussions");

  const output: TopicRedditData[] = [];

  for (const topic of topics) {
    try {
      const encoded = encodeURIComponent(topic);

      logger.info({ topic }, "Fetching Reddit data for topic");

      const searchUrl = `${REDDIT_ENDPOINTS.SEARCH}?q=${encoded}&limit=${REDDIT_PARAMS.LIMIT}&sort=${REDDIT_PARAMS.SORT}&t=${REDDIT_PARAMS.TIME}&type=link`;

      const response = await redditApiRequest(searchUrl);

      const posts = response.data.children
        .filter((child) => child.kind === "t3")
        .map((child) => mapPostToRedditItem(child.data));

      output.push({
        topic,
        posts,
      });

      logger.info(
        { topic, postsCount: posts.length },
        "Successfully fetched Reddit posts for topic",
      );

      if (topics.indexOf(topic) < topics.length - 1) {
        await delay(2000);
      }
    } catch (err) {
      logger.error(
        {
          topic,
          error: err instanceof Error ? err.message : "Unknown error",
        },
        "Failed to fetch Reddit data for topic",
      );

      output.push({
        topic,
        posts: [],
      });
    }
  }

  logger.info({ topicsCount: output.length }, "Reddit search completed");
  return output;
};
