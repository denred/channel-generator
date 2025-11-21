import {
  YOUTUBE_API_ENDPOINTS,
  YOUTUBE_API_PARAMS,
  YOUTUBE_API_PARTS,
} from "@/libs/constants/youtubeApi";
import { AppErrors } from "@/libs/enums/appErrors";
import { AppException } from "@/utils/appException";
import { logger } from "@/utils/logger";

import { youtubeApiRequest } from "./apiUtils";

interface ActivityItem {
  contentDetails: {
    upload?: {
      videoId: string;
    };
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: { high: { url: string } };
    publishedAt: string;
  };
}
interface ChannelsResponse {
  items?: Array<{
    id: string;
    contentDetails?: {
      relatedPlaylists?: {
        uploads?: string;
      };
    };
  }>;
}

interface PlaylistItemsResponse {
  items?: Array<{
    contentDetails?: { videoId?: string };
    snippet?: {
      title?: string;
      description?: string;
      thumbnails?: { high?: { url?: string } };
      publishedAt?: string;
    };
  }>;
}

export const getLastVideos = async (channelId: string) => {
  logger.info({ channelId }, "Fetching last videos for channel using PlaylistItems API");

  const channelData = await youtubeApiRequest<ChannelsResponse>({
    endpoint: YOUTUBE_API_ENDPOINTS.CHANNELS,
    searchParams: {
      part: YOUTUBE_API_PARTS.CONTENT_DETAILS,
      id: channelId,
    },
  });

  const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    logger.error({ channelId }, "Uploads playlist not found for channel");
    throw new AppException(AppErrors.VIDEOS_NOT_FOUND);
  }

  const data = await youtubeApiRequest<PlaylistItemsResponse>({
    endpoint: YOUTUBE_API_ENDPOINTS.PLAYLIST_ITEMS,
    searchParams: {
      part: `${YOUTUBE_API_PARTS.SNIPPET},${YOUTUBE_API_PARTS.CONTENT_DETAILS}`,
      playlistId: uploadsPlaylistId,
      maxResults: YOUTUBE_API_PARAMS.MAX_RESULTS_10,
    },
  });

  logger.info(
    { itemsCount: data.items?.length || 0 },
    "YouTube API response received (playlistItems)",
  );

  if (!data.items || !data.items.length) {
    logger.error({ channelId }, "No videos found in uploads playlist");
    throw new AppException(AppErrors.VIDEOS_NOT_FOUND);
  }

  const videos = data.items
    .filter((item) => !!item.contentDetails?.videoId)
    .map((item) => ({
      videoId: item.contentDetails!.videoId!,
      title: item.snippet?.title || "",
      thumbnail: item.snippet?.thumbnails?.high?.url || "",
      publishedAt: item.snippet?.publishedAt || "",
      description: item.snippet?.description || "",
    }));

  if (!videos.length) {
    logger.error({ channelId }, "No videos returned from uploads playlist");
    throw new AppException(AppErrors.VIDEOS_NOT_FOUND);
  }

  logger.info(
    {
      videosCount: videos.length,
      latestVideo: videos[0]?.title,
      latestDate: videos[0]?.publishedAt,
    },
    "Videos fetched successfully from uploads playlist",
  );

  return videos;
};
