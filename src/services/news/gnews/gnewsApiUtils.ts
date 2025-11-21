import { Env } from "@/config/env";
import { GNEWS_API_BASE_URL } from "@/libs/constants/gnewsApi";
import { AppErrors } from "@/libs/enums/appErrors";
import { AppException } from "@/utils/appException";
import { logger } from "@/utils/logger";

interface GNewsApiRequestOptions {
  endpoint: string;
  searchParams?: Record<string, string>;
}

export const gnewsApiRequest = async <T>(options: GNewsApiRequestOptions): Promise<T> => {
  const { endpoint, searchParams = {} } = options;
  const apiKey = Env.GNEWS_API_KEY;

  const url = new URL(`${GNEWS_API_BASE_URL}${endpoint}`);

  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  url.searchParams.set("apikey", apiKey);

  logger.info({ url: url.toString().replace(apiKey, "***") }, "Making GNews API request");

  try {
    const response = await fetch(url.toString());

    logger.info(
      {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      },
      "GNews API response",
    );

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(
        {
          status: response.status,
          statusText: response.statusText,
          errorBody,
        },
        "GNews API request failed",
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
      "Unexpected error in GNews API request",
    );
    throw new AppException(AppErrors.API_REQUEST_FAILED);
  }
};
