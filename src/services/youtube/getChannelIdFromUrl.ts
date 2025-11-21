import { YOUTUBE_API_ENDPOINTS, YOUTUBE_API_PARTS } from "@/libs/constants/youtubeApi";
import { AppErrors } from "@/libs/enums/appErrors";
import { YoutubePathPrefix } from "@/libs/enums/youtubePathPrefix";
import { AppException } from "@/utils/appException";
import { logger } from "@/utils/logger";

import { youtubeApiRequest } from "./apiUtils";

export const getChannelIdFromUrl = async (url: string): Promise<string> => {
  logger.info({ url }, "getChannelIdFromUrl - input URL");

  if (url.startsWith(YoutubePathPrefix.AT)) {
    const username = url.slice(1);
    logger.info({ username }, "Detected @ prefix");
    return await resolveUsername(username);
  }

  const { cleanPath, parsedURL } = normalizeUrl(url);
  logger.info({ cleanPath }, "Normalized cleanPath");

  if (cleanPath.startsWith(YoutubePathPrefix.AT)) {
    const username = cleanPath.slice(1);
    logger.info({ username }, "Detected @ in path");
    return await resolveUsername(username);
  }

  const pathParts = cleanPath.split("/");
  const prefix = pathParts[0] as YoutubePathPrefix;

  switch (prefix) {
    case YoutubePathPrefix.CHANNEL: {
      const id = pathParts[1];

      if (!id) {
        throw new AppException(AppErrors.INVALID_CHANNEL_URL);
      }

      if (id.startsWith("UC")) {
        return id;
      }

      throw new AppException(AppErrors.INVALID_CHANNEL_URL);
    }

    case YoutubePathPrefix.CUSTOM: {
      const customName = pathParts[1];

      if (!customName) {
        throw new AppException(AppErrors.INVALID_CHANNEL_URL);
      }

      return await resolveCustomName(customName);
    }

    case YoutubePathPrefix.USER: {
      const legacyName = pathParts[1];

      if (!legacyName) {
        throw new AppException(AppErrors.INVALID_CHANNEL_URL);
      }

      return await resolveUsername(legacyName);
    }

    case YoutubePathPrefix.WATCH: {
      const videoId = parsedURL.searchParams.get("v");

      if (!videoId) {
        throw new AppException(AppErrors.INVALID_CHANNEL_URL);
      }

      return await resolveVideoToChannelId(videoId);
    }

    default: {
      const possibleUsername = pathParts[0];

      if (possibleUsername) {
        logger.info({ possibleUsername }, "Trying to resolve as username");
        return await resolveUsername(possibleUsername);
      }

      throw new AppException(AppErrors.INVALID_CHANNEL_URL);
    }
  }
};

const resolveUsername = async (username: string): Promise<string> => {
  logger.info({ username }, "Resolving username");

  const cleanUsername = username.replace("@", "");

  const json = await youtubeApiRequest<{ items?: Array<{ id?: string }> }>({
    endpoint: YOUTUBE_API_ENDPOINTS.CHANNELS,
    searchParams: {
      part: YOUTUBE_API_PARTS.ID,
      forUsername: cleanUsername,
    },
  });

  logger.info({ hasResult: !!json?.items?.[0]?.id }, "forUsername result");

  if (!json?.items?.[0]?.id) {
    logger.info({ username: cleanUsername }, "Trying search API");
    const searchJson = await youtubeApiRequest<{
      items?: Array<{ snippet?: { channelId?: string; channelTitle?: string } }>;
    }>({
      endpoint: YOUTUBE_API_ENDPOINTS.SEARCH,
      searchParams: {
        part: YOUTUBE_API_PARTS.SNIPPET,
        q: cleanUsername,
        type: "channel",
        maxResults: "1",
      },
    });

    logger.info(
      {
        hasResult: !!searchJson?.items?.[0]?.snippet?.channelId,
        channelTitle: searchJson?.items?.[0]?.snippet?.channelTitle,
      },
      "search result",
    );

    if (searchJson?.items?.[0]?.snippet?.channelId) {
      return searchJson.items[0].snippet.channelId;
    }
  }

  if (json?.items?.[0]?.id) {
    const channelId = json.items[0].id;
    logger.info({ channelId }, "Successfully resolved channel");
    return channelId;
  }

  logger.error({ username }, "Channel not found");
  throw new AppException(AppErrors.CHANNEL_NOT_FOUND);
};

async function resolveCustomName(name: string): Promise<string> {
  const json = await youtubeApiRequest<{ items?: Array<{ snippet?: { channelId?: string } }> }>({
    endpoint: YOUTUBE_API_ENDPOINTS.SEARCH,
    searchParams: {
      part: YOUTUBE_API_PARTS.SNIPPET,
      type: "channel",
      q: name,
    },
  });

  if (!json?.items?.[0]?.snippet?.channelId) {
    throw new AppException(AppErrors.CHANNEL_NOT_FOUND);
  }

  return json.items[0].snippet.channelId;
}

const normalizeUrl = (url: string): { cleanPath: string; parsedURL: URL } => {
  let parsedURL: URL;

  try {
    parsedURL = new URL(url.startsWith("http") ? url : `https://${url}`);
  } catch {
    throw new AppException(AppErrors.INVALID_CHANNEL_URL);
  }

  return { cleanPath: parsedURL.pathname.replace(/^\/+/, ""), parsedURL };
};

export const resolveVideoToChannelId = async (videoId: string): Promise<string> => {
  const json = await youtubeApiRequest<{ items?: Array<{ snippet?: { channelId?: string } }> }>({
    endpoint: YOUTUBE_API_ENDPOINTS.VIDEOS,
    searchParams: {
      part: YOUTUBE_API_PARTS.SNIPPET,
      id: videoId,
    },
  });

  const channelId = json?.items?.[0]?.snippet?.channelId;

  if (!channelId) {
    throw new AppException(AppErrors.CHANNEL_NOT_FOUND);
  }

  return channelId;
};
