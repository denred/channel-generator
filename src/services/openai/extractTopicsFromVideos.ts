import { AppErrors } from "@/libs/enums/appErrors";
import { getOpenAIClient, OPENAI_MODEL } from "@/libs/openai/client";
import type { ExtractTopicsResult } from "@/types/openai";
import type { VideoData } from "@/types/videoData";
import { AppException } from "@/utils/appException";
import { getVideoExtractionPrompt } from "@/utils/getVideoExtractionPrompt";
import { logger } from "@/utils/logger";

export const extractTopicsFromVideos = async (
  videos: VideoData[],
): Promise<ExtractTopicsResult> => {
  logger.info({ videosCount: videos.length }, "Starting topic extraction");

  const prompt = getVideoExtractionPrompt(videos);
  const client = getOpenAIClient();

  try {
    const response = await client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const raw = response.choices[0].message.content ?? "";
    logger.info({ rawLength: raw.length }, "OpenAI response received");

    const parsed = JSON.parse(raw) as ExtractTopicsResult;
    logger.info({ topicsCount: parsed.topics?.length }, "Topics extracted successfully");

    return parsed;
  } catch (error) {
    logger.error(
      { error, message: error instanceof Error ? error.message : "Unknown error" },
      "Failed to extract topics",
    );
    throw new AppException(AppErrors.ANALYSIS_FAILED);
  }
};
