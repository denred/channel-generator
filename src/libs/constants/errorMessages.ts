import { AppErrors } from "../enums/appErrors";

export const ErrorMessages: Record<AppErrors, string> = {
  [AppErrors.INVALID_CHANNEL_URL]: "Invalid YouTube channel URL.",
  [AppErrors.CHANNEL_NOT_FOUND]: "YouTube channel not found.",
  [AppErrors.ANALYSIS_FAILED]: "Failed to analyze the channel.",
  [AppErrors.UNKNOWN_ERROR]: "Something went wrong. Please try again later.",
  [AppErrors.CHANNEL_URL_REQUIRED]: "Channel URL is required.",
  [AppErrors.YOUTUBE_CHANNEL_REQUIRED]: "YouTube channel URL is required.",
  [AppErrors.INVALID_YOUTUBE_CHANNEL]: "The provided URL is not a valid YouTube channel.",
  [AppErrors.API_KEY_MISSING]: "API key is missing.",
  [AppErrors.API_REQUEST_FAILED]: "API request failed.",
  [AppErrors.INVALID_API_RESPONSE]: "Received invalid response from API.",
  [AppErrors.VIDEOS_NOT_FOUND]: "No videos found for the specified channel.",
  [AppErrors.NEWS_FETCH_FAILED]: "Failed to fetch news articles.",
};
