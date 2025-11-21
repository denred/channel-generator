import { NextResponse, type NextRequest } from "next/server";

import { AppErrors } from "@/libs/enums/appErrors";
import { HttpCode } from "@/libs/enums/httpCode";
import { getRelevantNewsFromNewsApi } from "@/services/newsapi/getRelevantNewsFromNewsApi";
import { extractTopicsFromVideos } from "@/services/openai/extractTopicsFromVideos";
import { searchRedditDiscussions } from "@/services/reddit/searchRedditDiscussions";
import { getChannelIdFromUrl } from "@/services/youtube/getChannelIdFromUrl";
import { getLastVideos } from "@/services/youtube/getLastVideos";
import { getErrorResponse } from "@/utils/errorResponse";

interface AnalyzeChannelRequest {
  channelUrl: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const { channelUrl } = (await req.json()) as AnalyzeChannelRequest;

    if (!channelUrl) {
      return NextResponse.json(
        { error: AppErrors.CHANNEL_URL_REQUIRED },
        { status: HttpCode.BAD_REQUEST },
      );
    }

    const channelId = await getChannelIdFromUrl(channelUrl);
    const lastVideos = await getLastVideos(channelId);

    const topics = await extractTopicsFromVideos(
      lastVideos.map((v) => ({
        title: v.title,
        description: v.description,
      })),
    );

    const topicStrings = topics.topics.map((t) => t.topic);

    const news = await getRelevantNewsFromNewsApi(topicStrings);
    const reddit = await searchRedditDiscussions(topicStrings);

    return NextResponse.json(
      {
        status: HttpCode.OK,
        channelId,
        lastVideos,
        topics,
        news,
        reddit,
      },
      { status: HttpCode.OK },
    );
  } catch (err) {
    const { error, message, status } = getErrorResponse(err);

    return NextResponse.json({ error, message }, { status });
  }
};
