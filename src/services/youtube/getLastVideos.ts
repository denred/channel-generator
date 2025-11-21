import {
  YOUTUBE_API_ENDPOINTS,
  YOUTUBE_API_PARAMS,
  YOUTUBE_API_PARTS,
} from "@/libs/constants/youtubeApi";
import { AppErrors } from "@/libs/enums/appErrors";
import { AppException } from "@/utils/appException";

import { youtubeApiRequest } from "./apiUtils";

interface VideoItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { high: { url: string } };
    publishedAt: string;
  };
}

interface YouTubeSearchResponse {
  items?: VideoItem[];
}

export const getLastVideos = async (channelId: string) => {
  const data = await youtubeApiRequest<YouTubeSearchResponse>({
    endpoint: YOUTUBE_API_ENDPOINTS.SEARCH,
    searchParams: {
      part: YOUTUBE_API_PARTS.SNIPPET,
      channelId,
      order: YOUTUBE_API_PARAMS.ORDER_DATE,
      maxResults: YOUTUBE_API_PARAMS.MAX_RESULTS_10,
      type: YOUTUBE_API_PARAMS.TYPE_VIDEO,
    },
  });

  if (!data.items || !data.items.length) {
    throw new AppException(AppErrors.VIDEOS_NOT_FOUND);
  }

  const videos = data.items.map((item: VideoItem) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    publishedAt: item.snippet.publishedAt,
    description: item.snippet.description,
  }));

  return videos;
};
