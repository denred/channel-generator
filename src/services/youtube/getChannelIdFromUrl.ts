import { YOUTUBE_API_ENDPOINTS, YOUTUBE_API_PARTS } from "@/libs/constants/youtubeApi";
import { AppErrors } from "@/libs/enums/appErrors";
import { YoutubePathPrefix } from "@/libs/enums/youtubePathPrefix";
import { AppException } from "@/utils/appException";

import { youtubeApiRequest } from "./apiUtils";

export const getChannelIdFromUrl = async (url: string): Promise<string> => {
  if (url.startsWith(YoutubePathPrefix.AT)) {
    return await resolveUsername(url.slice(1));
  }

  const { cleanPath, parsedURL } = normalizeUrl(url);
  const prefix = cleanPath.split("/")[0] as YoutubePathPrefix;

  switch (prefix) {
    case YoutubePathPrefix.CHANNEL: {
      const id = cleanPath.replace(`${YoutubePathPrefix.CHANNEL}/`, "");

      if (id.startsWith("UC")) {
        return id;
      }

      throw new AppException(AppErrors.INVALID_CHANNEL_URL);
    }

    case YoutubePathPrefix.AT: {
      const username = cleanPath.replace(YoutubePathPrefix.AT, "");

      return await resolveUsername(username);
    }

    case YoutubePathPrefix.CUSTOM: {
      const customName = cleanPath.replace(`${YoutubePathPrefix.CUSTOM}/`, "");

      return await resolveCustomName(customName);
    }

    case YoutubePathPrefix.USER: {
      const legacyName = cleanPath.replace(`${YoutubePathPrefix.USER}/`, "");

      return await resolveUsername(legacyName);
    }

    case YoutubePathPrefix.WATCH: {
      const videoId = parsedURL.searchParams.get("v");

      if (!videoId) {
        throw new AppException(AppErrors.INVALID_CHANNEL_URL);
      }

      return await resolveVideoToChannelId(videoId);
    }

    default:
      throw new AppException(AppErrors.INVALID_CHANNEL_URL);
  }
};

const resolveUsername = async (username: string): Promise<string> => {
  const json = await youtubeApiRequest<{ items?: Array<{ id?: string }> }>({
    endpoint: YOUTUBE_API_ENDPOINTS.CHANNELS,
    searchParams: {
      part: YOUTUBE_API_PARTS.ID,
      forUsername: username,
    },
  });

  if (!json?.items?.[0]?.id) {
    throw new AppException(AppErrors.CHANNEL_NOT_FOUND);
  }

  return json.items[0].id;
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
