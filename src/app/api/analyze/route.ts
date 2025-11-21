import { NextResponse, type NextRequest } from "next/server";

import { AppErrors } from "@/libs/enums/appErrors";
import { HttpCode } from "@/libs/enums/httpCode";
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

    return NextResponse.json(
      {
        status: HttpCode.OK,
        channelId,
        lastVideos,
      },
      { status: HttpCode.OK },
    );
  } catch (err) {
    const { error, message, status } = getErrorResponse(err);

    return NextResponse.json({ error, message }, { status });
  }
};
