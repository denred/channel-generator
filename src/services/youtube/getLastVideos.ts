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

interface YouTubeActivitiesResponse {
  items?: ActivityItem[];
}

export const getLastVideos = async (channelId: string) => {
  logger.info({ channelId }, "Fetching last videos for channel using Activities API");

  const data = await youtubeApiRequest<YouTubeActivitiesResponse>({
    endpoint: YOUTUBE_API_ENDPOINTS.ACTIVITIES,
    searchParams: {
      part: `${YOUTUBE_API_PARTS.SNIPPET},${YOUTUBE_API_PARTS.CONTENT_DETAILS}`,
      channelId,
      maxResults: YOUTUBE_API_PARAMS.MAX_RESULTS_10,
    },
  });

  logger.info({ itemsCount: data.items?.length || 0 }, "YouTube API response received");

  if (!data.items || !data.items.length) {
    logger.error({ channelId }, "No videos found for channel");
    throw new AppException(AppErrors.VIDEOS_NOT_FOUND);
  }

  const videos = data.items
    .filter((item) => item.contentDetails.upload?.videoId)
    .map((item) => ({
      videoId: item.contentDetails.upload!.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description,
    }));

  if (!videos.length) {
    logger.error({ channelId }, "No video uploads found in activities");
    throw new AppException(AppErrors.VIDEOS_NOT_FOUND);
  }

  logger.info(
    {
      videosCount: videos.length,
      latestVideo: videos[0]?.title,
      latestDate: videos[0]?.publishedAt,
    },
    "Videos fetched successfully from Activities API",
  );

  return videos;
};
