import { YOUTUBE_API_BASE_URL } from "@/libs/constants/youtubeApi";
import { AppErrors } from "@/libs/enums/appErrors";
import { AppException } from "@/utils/appException";

export const getApiKey = (): string => {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new AppException(AppErrors.API_KEY_MISSING);
  }

  return apiKey;
};

export const injectApiKey = (url: string): string => {
  const apiKey = getApiKey();
  const urlObj = new URL(url);
  urlObj.searchParams.set("key", apiKey);

  return urlObj.toString();
};

interface YoutubeApiRequestOptions {
  endpoint: string;
  searchParams?: Record<string, string>;
}

export const youtubeApiRequest = async <T>(options: YoutubeApiRequestOptions): Promise<T> => {
  const { endpoint, searchParams = {} } = options;
  const apiKey = getApiKey();

  const url = new URL(`${YOUTUBE_API_BASE_URL}${endpoint}`);

  Object.entries(searchParams).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  url.searchParams.set("key", apiKey);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new AppException(AppErrors.API_REQUEST_FAILED);
    }

    const data = (await response.json()) as T;

    return data;
  } catch (error) {
    if (error instanceof AppException) {
      throw error;
    }
    throw new AppException(AppErrors.API_REQUEST_FAILED);
  }
};
