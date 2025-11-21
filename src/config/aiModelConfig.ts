import { AiModel } from "@/libs/enums/aiModel";

export const AI_MODEL_CONFIG = {
  [AiModel.GPT_4O_MINI]: {
    temperature: 0.75,
    maxTokens: 2000,
    json: true,
    responseType: "json_object",
  },
  [AiModel.GPT_4O]: {
    temperature: 0.2,
    maxTokens: 3000,
    json: true,
    responseType: "json_object",
  },
} as const;

export const DEFAULT_AI_MODEL = AiModel.GPT_4O_MINI;
