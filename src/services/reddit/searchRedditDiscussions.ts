import { REDDIT_ENDPOINTS, REDDIT_PARAMS } from "@/libs/constants/redditApi";
import type { RedditCommentRaw, RedditItem, RedditPostRaw, TopicRedditData } from "@/types/reddit";
import { logger } from "@/utils/logger";

import { redditApiRequest } from "./redditApiUtils";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mapCommentToRedditItem = (comment: RedditCommentRaw): RedditItem => ({
  text: comment.body,
  score: comment.score,
  author: comment.author,
  permalink: `https://www.reddit.com${comment.permalink ?? ""}`,
  createdUtc: comment.created_utc,
});

const mapPostToRedditItem = (post: RedditPostRaw): RedditItem => ({
  text: post.title,
  score: post.score,
  author: post.author,
  permalink: post.full_link || `https://www.reddit.com${post.permalink ?? ""}`,
  createdUtc: post.created_utc,
});

export const searchRedditDiscussions = async (topics: string[]): Promise<TopicRedditData[]> => {
  logger.info(`Searching Reddit discussions for ${topics.length} topics using Pushshift API`);

  const output: TopicRedditData[] = [];

  for (const topic of topics) {
    try {
      const encoded = encodeURIComponent(topic);

      logger.info(`Fetching Reddit data for topic: ${topic}`);

      const [comments, posts] = await Promise.all([
        redditApiRequest<RedditCommentRaw>(
          `${REDDIT_ENDPOINTS.COMMENT}?q=${encoded}&size=${REDDIT_PARAMS.SIZE}&sort=${REDDIT_PARAMS.SORT}&sort_type=${REDDIT_PARAMS.SORT_TYPE}`,
        ),
        redditApiRequest<RedditPostRaw>(
          `${REDDIT_ENDPOINTS.SUBMISSION}?q=${encoded}&size=${REDDIT_PARAMS.SIZE}&sort=${REDDIT_PARAMS.SORT}&sort_type=${REDDIT_PARAMS.SORT_TYPE}`,
        ),
      ]);

      output.push({
        topic,
        comments: comments.map(mapCommentToRedditItem),
        posts: posts.map(mapPostToRedditItem),
      });

      logger.info(
        `Successfully fetched ${comments.length} comments and ${posts.length} posts for topic: ${topic}`,
      );

      if (topics.indexOf(topic) < topics.length - 1) {
        await delay(1000);
      }
    } catch (err) {
      logger.error(
        `Failed to fetch Reddit data for topic: ${topic} - ${err instanceof Error ? err.message : "Unknown error"}`,
      );

      output.push({
        topic,
        comments: [],
        posts: [],
      });
    }
  }

  logger.info(`Reddit search completed. Fetched data for ${output.length} topics`);
  return output;
};
