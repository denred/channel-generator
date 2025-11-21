import { GNEWS_API_ENDPOINTS, GNEWS_API_PARAMS } from "@/libs/constants/gnewsApi";
import type { NewsItem, TopicWithNews } from "@/types/news";
import { AppException } from "@/utils/appException";
import { logger } from "@/utils/logger";

import { gnewsApiRequest } from "./gnewsApiUtils";

interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  source: { name: string };
  publishedAt: string;
}

interface GNewsResponse {
  articles: GNewsArticle[];
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRelevantNews = async (topics: string[]): Promise<TopicWithNews[]> => {
  const results: TopicWithNews[] = [];

  logger.info({ topicsCount: topics.length, topics }, "Fetching news for topics");

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];

    try {
      logger.info({ topic, progress: `${i + 1}/${topics.length}` }, "Fetching news for topic");

      const json = await gnewsApiRequest<GNewsResponse>({
        endpoint: GNEWS_API_ENDPOINTS.SEARCH,
        searchParams: {
          q: topic,
          lang: GNEWS_API_PARAMS.LANG_EN,
          max: GNEWS_API_PARAMS.MAX_5,
        },
      });

      if (!json.articles) {
        logger.warn({ topic }, "No articles found for topic");
        continue;
      }

      const articles: NewsItem[] = json.articles.map((a) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        source: a.source?.name ?? "",
        publishedAt: a.publishedAt,
      }));

      logger.info({ topic, articlesCount: articles.length }, "News fetched for topic");
      results.push({ topic, news: articles });

      // Add delay between requests to avoid rate limiting (1 second)
      if (i < topics.length - 1) {
        logger.info("Waiting 1 second before next request to avoid rate limiting");
        await delay(1000);
      }
    } catch (error) {
      logger.error(
        {
          topic,
          error: error instanceof Error ? error.message : "Unknown error",
          errorType: error instanceof AppException ? error.code : "Unknown",
        },
        "Failed to fetch news for topic",
      );

      // If rate limited, log a warning but don't fail the entire request
      // Return partial results instead
      logger.warn(
        { resultsCount: results.length, totalTopics: topics.length },
        "Returning partial results due to rate limiting",
      );
      break;
    }
  }

  logger.info({ resultsCount: results.length }, "News fetching completed");

  return results;
};
