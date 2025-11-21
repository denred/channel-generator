import { AiRole } from "@/libs/enums/aiRole";
import { AppErrors } from "@/libs/enums/appErrors";
import { getOpenAIClient } from "@/libs/openai/client";
import type { GenerateVideoIdeasInput, VideoIdea } from "@/types/videoIdea";
import { AppException } from "@/utils/appException";
import { getVideoIdeasPrompt } from "@/utils/getVideoIdeasPrompt";
import { logger } from "@/utils/logger";
import { parseJsonSafe } from "@/utils/parseJsonSafe";

import { DEFAULT_AI_MODEL, AI_MODEL_CONFIG } from "../../config/aiModelConfig";

interface VideoIdeasResponse {
  ideas: VideoIdea[];
}

export const generateVideoIdeas = async (input: GenerateVideoIdeasInput): Promise<VideoIdea[]> => {
  try {
    logger.info("Generating video ideas with OpenAI");

    const openai = getOpenAIClient();
    const prompt = getVideoIdeasPrompt(input);
    const model = DEFAULT_AI_MODEL;
    const cfg = AI_MODEL_CONFIG[model];

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: AiRole.USER, content: prompt }],
      temperature: cfg.temperature,
      max_tokens: cfg.maxTokens,
      ...(cfg.json && { response_format: { type: cfg.responseType } }),
    });

    const content = response.choices[0].message.content;

    if (!content) {
      logger.error("OpenAI returned empty content");
      throw new AppException(AppErrors.INVALID_API_RESPONSE);
    }

    const parsed = parseJsonSafe<VideoIdeasResponse>(content);

    if (!parsed?.ideas?.length) {
      logger.error({ raw: content }, "Invalid OpenAI response format");
      throw new AppException(AppErrors.INVALID_API_RESPONSE);
    }

    logger.info(`Generated ${parsed.ideas.length} video ideas`);

    return parsed.ideas;
  } catch (err) {
    logger.error(
      `Failed to generate video ideas: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
    throw new AppException(AppErrors.ANALYSIS_FAILED);
  }
};
