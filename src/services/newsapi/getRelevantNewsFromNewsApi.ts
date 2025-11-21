import { NEWSAPI_ENDPOINTS, NEWSAPI_PARAMS } from "@/libs/constants/newsApi";
import type { NewsItem, TopicWithNews } from "@/types/news";
import { logger } from "@/utils/logger";

import { newsApiRequest } from "./newsApiUtils";

interface NewsApiArticle {
  title: string;
  description: string;
  url: string;
  source: { name: string };
  publishedAt: string;
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRelevantNewsFromNewsApi = async (topics: string[]): Promise<TopicWithNews[]> => {
  const results: TopicWithNews[] = [];

  logger.info({ topicsCount: topics.length, topics }, "Fetching news for topics from NewsAPI");

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];

    try {
      logger.info({ topic, progress: `${i + 1}/${topics.length}` }, "Fetching news for topic");

      const json = await newsApiRequest<NewsApiResponse>({
        endpoint: NEWSAPI_ENDPOINTS.EVERYTHING,
        searchParams: {
          q: topic,
          language: NEWSAPI_PARAMS.LANG_EN,
          pageSize: NEWSAPI_PARAMS.PAGE_SIZE_5,
          sortBy: NEWSAPI_PARAMS.SORT_BY_RELEVANCY,
        },
      });

      if (!json.articles || json.articles.length === 0) {
        logger.warn({ topic }, "No articles found for topic");
        continue;
      }

      const articles: NewsItem[] = json.articles.map((a) => ({
        title: a.title,
        description: a.description || "",
        url: a.url,
        source: a.source?.name ?? "",
        publishedAt: a.publishedAt,
      }));

      logger.info({ topic, articlesCount: articles.length }, "News fetched for topic");
      results.push({ topic, news: articles });

      if (i < topics.length - 1) {
        logger.info("Waiting 1 second before next request to avoid rate limiting");
        await delay(1000);
      }
    } catch (error) {
      logger.error(
        {
          topic,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        "Failed to fetch news for topic",
      );

      logger.warn(
        { resultsCount: results.length, totalTopics: topics.length },
        "Returning partial results due to error",
      );
      break;
    }
  }

  logger.info({ resultsCount: results.length }, "News fetching completed");

  return results;
};
