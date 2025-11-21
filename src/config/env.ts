import { AppErrors } from "@/libs/enums/appErrors";
import { AppException } from "@/utils/appException";

const getEnvVariable = (key: string): string => {
  const value = process.env[key];

  if (!value || value.length === 0) {
    throw new AppException(AppErrors.API_KEY_MISSING);
  }

  return value;
};

export const Env = {
  get YOUTUBE_API_KEY(): string {
    return getEnvVariable("YOUTUBE_API_KEY");
  },
  get OPENAI_API_KEY(): string {
    return getEnvVariable("OPENAI_API_KEY");
  },
  get NODE_ENV(): string {
    return process.env.NODE_ENV || "development";
  },
  get LOG_LEVEL(): string {
    return process.env.LOG_LEVEL || "info";
  },
  get GNEWS_API_KEY(): string {
    return getEnvVariable("GNEWS_API_KEY");
  },
  get NEWSAPI_KEY(): string {
    return getEnvVariable("NEWSAPI_KEY");
  },
  get ENABLE_REDDIT(): boolean {
    return process.env.ENABLE_REDDIT !== "false";
  },
};
