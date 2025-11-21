import { Env } from "@/config/env";
import { NEWSAPI_BASE_URL } from "@/libs/constants/newsApi";
import { AppErrors } from "@/libs/enums/appErrors";
import { AppException } from "@/utils/appException";
import { logger } from "@/utils/logger";

interface NewsApiRequestOptions {
  endpoint: string;
  searchParams?: Record<string, string>;
}

export const newsApiRequest = async <T>(options: NewsApiRequestOptions): Promise<T> => {
  const { endpoint, searchParams = {} } = options;
  const apiKey = Env.NEWSAPI_KEY;

  const url = new URL(`${NEWSAPI_BASE_URL}${endpoint}`);

  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  logger.info({ url: url.toString().replace(apiKey, "***") }, "Making NewsAPI request");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    logger.info(
      {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      },
      "NewsAPI response",
    );

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(
        {
          status: response.status,
          statusText: response.statusText,
          errorBody,
        },
        "NewsAPI request failed",
      );
      throw new AppException(AppErrors.API_REQUEST_FAILED);
    }

    const data = (await response.json()) as T;

    return data;
  } catch (error) {
    if (error instanceof AppException) {
      throw error;
    }
    logger.error(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        errorStack: error instanceof Error ? error.stack : undefined,
      },
      "Unexpected error in NewsAPI request",
    );
    throw new AppException(AppErrors.API_REQUEST_FAILED);
  }
};
