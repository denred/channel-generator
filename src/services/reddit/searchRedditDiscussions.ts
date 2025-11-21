import { Env } from "@/config/env";
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
  const redditEnabled = Env.ENABLE_REDDIT;
  logger.info(
    {
      redditEnabled,
      enableRedditEnv: process.env.ENABLE_REDDIT,
      nodeEnv: process.env.NODE_ENV,
    },
    "Reddit search configuration",
  );

  if (!redditEnabled) {
    logger.info("Reddit search disabled via ENABLE_REDDIT environment variable");
    return topics.map((topic) => ({ topic, posts: [] }));
  }

  logger.info({ topicsCount: topics.length }, "Searching Reddit discussions");

  const output: TopicRedditData[] = [];
  let consecutiveFailures = 0;
  const maxConsecutiveFailures = 1;

  for (const topic of topics) {
    try {
      if (consecutiveFailures >= maxConsecutiveFailures) {
        logger.warn(
          { consecutiveFailures, remainingTopics: topics.length - topics.indexOf(topic) },
          "Skipping remaining topics - Reddit API appears to be unavailable",
        );
        output.push({
          topic,
          posts: [],
        });
        continue;
      }

      const encoded = encodeURIComponent(topic);

      logger.info({ topic }, "Fetching Reddit data for topic");

      const searchUrl = `${REDDIT_ENDPOINTS.SEARCH}?q=${encoded}&limit=${REDDIT_PARAMS.LIMIT}&sort=${REDDIT_PARAMS.SORT}&t=${REDDIT_PARAMS.TIME}&type=link&raw_json=${REDDIT_PARAMS.RAW_JSON}&restrict_sr=`;

      const response = await redditApiRequest(searchUrl);

      const posts = response.data.children
        .filter((child) => child.kind === "t3")
        .map((child) => mapPostToRedditItem(child.data));

      output.push({
        topic,
        posts,
      });

      consecutiveFailures = 0;

      logger.info(
        { topic, postsCount: posts.length },
        "Successfully fetched Reddit posts for topic",
      );

      if (topics.indexOf(topic) < topics.length - 1) {
        await delay(3000);
      }
    } catch (err) {
      consecutiveFailures++;
      logger.error(
        {
          topic,
          error: err instanceof Error ? err.message : "Unknown error",
          consecutiveFailures,
        },
        "Failed to fetch Reddit data for topic",
      );

      output.push({
        topic,
        posts: [],
      });
    }
  }

  const successfulTopics = output.filter((t) => t.posts.length > 0).length;
  logger.info(
    {
      topicsCount: output.length,
      successfulTopics,
      failedTopics: output.length - successfulTopics,
    },
    "Reddit search completed",
  );
  return output;
};
