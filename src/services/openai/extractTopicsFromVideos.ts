import { AiModel } from "@/libs/enums/aiModel";
import { AiRole } from "@/libs/enums/aiRole";
import { AppErrors } from "@/libs/enums/appErrors";
import { getOpenAIClient } from "@/libs/openai/client";
import type { ExtractTopicsResult } from "@/types/openai";
import type { VideoData } from "@/types/videoData";
import { AppException } from "@/utils/appException";
import { getVideoExtractionPrompt } from "@/utils/getVideoExtractionPrompt";
import { logger } from "@/utils/logger";
import { parseJsonSafe } from "@/utils/parseJsonSafe";

import { AI_MODEL_CONFIG } from "../../config/aiModelConfig";

export const extractTopicsFromVideos = async (
  videos: VideoData[],
): Promise<ExtractTopicsResult> => {
  try {
    logger.info({ videosCount: videos.length }, "Starting topic extraction");

    const prompt = getVideoExtractionPrompt(videos);
    const openai = getOpenAIClient();
    const model = AiModel.GPT_4O;
    const cfg = AI_MODEL_CONFIG[model];

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: AiRole.USER, content: prompt }],
      temperature: cfg.temperature,
      max_tokens: cfg.maxTokens,
      ...(cfg.json ? { response_format: { type: cfg.responseType } } : {}),
    });

    const content = response.choices[0].message.content;

    if (!content) {
      logger.error("OpenAI returned empty content");
      throw new AppException(AppErrors.INVALID_API_RESPONSE);
    }

    const parsed = parseJsonSafe<ExtractTopicsResult>(content);

    if (!parsed) {
      logger.error({ raw: content }, "Invalid OpenAI response format");
      throw new AppException(AppErrors.INVALID_API_RESPONSE);
    }

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
