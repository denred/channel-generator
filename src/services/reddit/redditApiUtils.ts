import { AppErrors } from "@/libs/enums/appErrors";
import type { RedditSearchResponse } from "@/types/reddit";
import { AppException } from "@/utils/appException";
import { logger } from "@/utils/logger";

export const redditApiRequest = async (url: string, retries = 2): Promise<RedditSearchResponse> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const maskedUrl = url.replace(/q=[^&]+/, "q=***");
      logger.info({ url: maskedUrl, attempt: attempt + 1 }, "Reddit API Request");

      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok) {
        const errorText = await res.text();
        logger.error(
          {
            status: res.status,
            statusText: res.statusText,
            error: errorText,
            url: maskedUrl,
            attempt: attempt + 1,
          },
          "Reddit API Error",
        );

        if (res.status === 429 && attempt < retries) {
          logger.warn("Rate limited, waiting before retry...");
          await new Promise((resolve) => setTimeout(resolve, 5_000 * (attempt + 1)));
          continue;
        }

        throw new AppException(AppErrors.REDDIT_API_FAILED);
      }

      const json = (await res.json()) as RedditSearchResponse;

      if (!json.data || !Array.isArray(json.data.children)) {
        logger.error({ response: json }, "Reddit API returned invalid data structure");
        throw new AppException(AppErrors.REDDIT_API_FAILED);
      }

      logger.info(
        { postsCount: json.data.children.length, attempt: attempt + 1 },
        "Reddit API Success",
      );
      return json;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error("Unknown error");
      logger.error(
        {
          error: lastError.message,
          stack: lastError.stack,
          attempt: attempt + 1,
          retriesLeft: retries - attempt,
        },
        "Reddit API Request Failed",
      );

      if (attempt < retries && !(err instanceof AppException)) {
        await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
        continue;
      }

      throw err instanceof AppException ? err : new AppException(AppErrors.REDDIT_API_FAILED);
    }
  }

  throw lastError || new AppException(AppErrors.REDDIT_API_FAILED);
};
