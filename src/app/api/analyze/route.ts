import { NextResponse, type NextRequest } from "next/server";

import { AppErrors } from "@/libs/enums/appErrors";
import { HttpCode } from "@/libs/enums/httpCode";
import { getRelevantNews } from "@/services/news/gnews/getrelevantNews";
import { extractTopicsFromVideos } from "@/services/openai/extractTopicsFromVideos";
import { generateVideoIdeas } from "@/services/openai/generateVideoIdeas";
import { searchRedditDiscussions } from "@/services/reddit/searchRedditDiscussions";
import { getChannelIdFromUrl } from "@/services/youtube/getChannelIdFromUrl";
import { getChannelInfo } from "@/services/youtube/getChannelInfo";
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
    const [channelInfo, lastVideos] = await Promise.all([
      getChannelInfo(channelId),
      getLastVideos(channelId),
    ]);

    const topics = await extractTopicsFromVideos(lastVideos);
    const topicStrings = topics.topics.map((t) => t.topic);

    // const news = await getRelevantNewsFromNewsApi(topicStrings);
    const news = await getRelevantNews(topicStrings);
    const reddit = await searchRedditDiscussions(topicStrings);

    const ideas = await generateVideoIdeas({
      topics: topics.topics,
      news,
      reddit,
      recentVideoTitles: lastVideos.map((v) => v.title),
    });

    return NextResponse.json(
      {
        status: HttpCode.OK,
        channelId,
        channelName: channelInfo.channelName,
        lastVideos,
        topics,
        news,
        reddit,
        ideas,
      },
      { status: HttpCode.OK },
    );
  } catch (err) {
    const { error, message, status } = getErrorResponse(err);

    return NextResponse.json({ error, message }, { status });
  }
};
