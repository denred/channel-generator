import { AppErrors } from "@/libs/enums/appErrors";
import type { RedditSearchResponse } from "@/types/reddit";
import { AppException } from "@/utils/appException";
import { logger } from "@/utils/logger";

export const redditApiRequest = async (url: string, retries = 2): Promise<RedditSearchResponse> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const maskedUrl = url.replace(/q=[^&]+/, "q=***");
      logger.info(
        {
          url: maskedUrl,
          fullUrl: url.substring(0, 100),
          attempt: attempt + 1,
          env: process.env.NODE_ENV,
        },
        "Reddit API Request Starting",
      );

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15_000);

      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json",
        },
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text();
        const headers: Record<string, string> = {};
        res.headers.forEach((value, key) => {
          headers[key] = value;
        });

        logger.error(
          {
            status: res.status,
            statusText: res.statusText,
            error: errorText.substring(0, 500),
            headers,
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
      const errorDetails = {
        error: lastError.message,
        errorName: lastError.name,
        stack: lastError.stack,
        attempt: attempt + 1,
        retriesLeft: retries - attempt,
        isAbortError: lastError.name === "AbortError",
        isTimeout: lastError.message.includes("timeout"),
      };
      logger.error(errorDetails, "Reddit API Request Failed");

      if (attempt < retries && !(err instanceof AppException)) {
        await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
        continue;
      }

      throw err instanceof AppException ? err : new AppException(AppErrors.REDDIT_API_FAILED);
    }
  }

  throw lastError || new AppException(AppErrors.REDDIT_API_FAILED);
};
