import { YOUTUBE_API_ENDPOINTS, YOUTUBE_API_PARTS } from "@/libs/constants/youtubeApi";
import { AppErrors } from "@/libs/enums/appErrors";
import { AppException } from "@/utils/appException";
import { logger } from "@/utils/logger";

import { youtubeApiRequest } from "./apiUtils";

interface ChannelSnippet {
  title: string;
  description: string;
  customUrl?: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
}

interface ChannelItem {
  id: string;
  snippet: ChannelSnippet;
}

interface YouTubeChannelsResponse {
  items?: ChannelItem[];
}

export interface ChannelInfo {
  channelId: string;
  channelName: string;
  description: string;
  customUrl?: string;
  thumbnail: string;
}

export const getChannelInfo = async (channelId: string): Promise<ChannelInfo> => {
  logger.info({ channelId }, "Fetching channel info");

  const data = await youtubeApiRequest<YouTubeChannelsResponse>({
    endpoint: YOUTUBE_API_ENDPOINTS.CHANNELS,
    searchParams: {
      part: YOUTUBE_API_PARTS.SNIPPET,
      id: channelId,
    },
  });

  if (!data.items || !data.items.length) {
    logger.error({ channelId }, "Channel not found");
    throw new AppException(AppErrors.CHANNEL_NOT_FOUND);
  }

  const channel = data.items[0];

  return {
    channelId: channel.id,
    channelName: channel.snippet.title,
    description: channel.snippet.description,
    customUrl: channel.snippet.customUrl,
    thumbnail: channel.snippet.thumbnails.high.url,
  };
};
