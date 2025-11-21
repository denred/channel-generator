import { AppErrors } from "@/libs/enums/appErrors";
import type { RedditSearchResponse } from "@/types/reddit";
import { AppException } from "@/utils/appException";
import { logger } from "@/utils/logger";
export const redditApiRequest = async (url: string, retries = 2): Promise<RedditSearchResponse> => {
  let lastError: Error | null = null;
  const urlsToTry = [url];

  if (url.includes("www.reddit.com")) {
    urlsToTry.push(url.replace("www.reddit.com", "old.reddit.com"));
  } else if (url.includes("old.reddit.com")) {
    urlsToTry.push(url.replace("old.reddit.com", "www.reddit.com"));
  }

  const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/121.0",
  ];

  for (const currentUrl of urlsToTry) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const maskedUrl = currentUrl.replace(/q=[^&]+/, "q=***");
        const randomUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

        logger.info(
          {
            url: maskedUrl,
            baseUrl: new URL(currentUrl).origin,
            fullUrl: currentUrl.substring(0, 200),
            attempt: attempt + 1,
            urlVariant: urlsToTry.indexOf(currentUrl) + 1,
            totalVariants: urlsToTry.length,
            env: process.env.NODE_ENV,
          },
          "Reddit API Request Starting",
        );

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15_000);

        const res = await fetch(currentUrl, {
          method: "GET",
          headers: {
            "User-Agent": randomUA,
            Accept: "application/json",
            "Cache-Control": "no-cache",
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
          urlVariant: urlsToTry.indexOf(currentUrl) + 1,
          isAbortError: lastError.name === "AbortError",
          isTimeout: lastError.message.includes("timeout"),
        };
        logger.error(errorDetails, "Reddit API Request Failed");

        if (attempt < retries && !(err instanceof AppException)) {
          await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
          continue;
        }

        if (urlsToTry.indexOf(currentUrl) < urlsToTry.length - 1) {
          logger.info(
            { nextUrl: urlsToTry[urlsToTry.indexOf(currentUrl) + 1] },
            "Trying alternative Reddit URL",
          );
          break;
        }

        throw err instanceof AppException ? err : new AppException(AppErrors.REDDIT_API_FAILED);
      }
    }
  }

  throw lastError || new AppException(AppErrors.REDDIT_API_FAILED);
};
