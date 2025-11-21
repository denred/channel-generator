import { AppErrors } from "@/libs/enums/appErrors";
import { AppException } from "@/utils/appException";
import { logger } from "@/utils/logger";

interface PushshiftResponse {
  data: unknown[];
}

export const redditApiRequest = async <T>(url: string): Promise<T[]> => {
  try {
    const maskedUrl = url.replace(/q=[^&]+/, "q=***");
    logger.info(`Pushshift API Request: ${maskedUrl}`);

    const res = await fetch(url);

    if (!res.ok) {
      logger.error(`Pushshift API Error: ${res.status} ${res.statusText}`);
      throw new AppException(AppErrors.REDDIT_API_FAILED);
    }

    const json = (await res.json()) as PushshiftResponse;

    if (!json.data || !Array.isArray(json.data)) {
      logger.error("Pushshift API returned invalid data structure");
      throw new AppException(AppErrors.REDDIT_API_FAILED);
    }

    logger.info(`Pushshift API Success: ${json.data.length} items received`);
    return json.data as T[];
  } catch (err) {
    logger.error(
      `Pushshift API Request Failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
    throw err instanceof AppException ? err : new AppException(AppErrors.REDDIT_API_FAILED);
  }
};
