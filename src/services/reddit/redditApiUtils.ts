import { AppErrors } from "@/libs/enums/appErrors";
import type { RedditSearchResponse } from "@/types/reddit";
import { AppException } from "@/utils/appException";
import { logger } from "@/utils/logger";

export const redditApiRequest = async (url: string): Promise<RedditSearchResponse> => {
  try {
    const maskedUrl = url.replace(/q=[^&]+/, "q=***");
    logger.info({ url: maskedUrl }, "Reddit API Request");

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ChannelAnalyzer/1.0)",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      logger.error(
        {
          status: res.status,
          statusText: res.statusText,
          error: errorText,
        },
        "Reddit API Error",
      );
      throw new AppException(AppErrors.REDDIT_API_FAILED);
    }

    const json = (await res.json()) as RedditSearchResponse;

    if (!json.data || !Array.isArray(json.data.children)) {
      logger.error({ response: json }, "Reddit API returned invalid data structure");
      throw new AppException(AppErrors.REDDIT_API_FAILED);
    }

    logger.info({ postsCount: json.data.children.length }, "Reddit API Success");
    return json;
  } catch (err) {
    logger.error(
      {
        error: err instanceof Error ? err.message : "Unknown error",
      },
      "Reddit API Request Failed",
    );
    throw err instanceof AppException ? err : new AppException(AppErrors.REDDIT_API_FAILED);
  }
};
