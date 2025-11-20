import { AppErrors } from "../enums/appErrors";

export const ErrorMessages: Record<AppErrors, string> = {
  [AppErrors.INVALID_CHANNEL_URL]: "Invalid YouTube channel URL.",
  [AppErrors.CHANNEL_NOT_FOUND]: "YouTube channel not found.",
  [AppErrors.ANALYSIS_FAILED]: "Failed to analyze the channel.",
  [AppErrors.UNKNOWN_ERROR]: "Something went wrong. Please try again later.",
  [AppErrors.CHANNEL_URL_REQUIRED]: "Channel URL is required.",
};
