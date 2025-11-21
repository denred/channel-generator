import OpenAI from "openai";

import { Env } from "@/config/env";

let client: OpenAI | null = null;

export const getOpenAIClient = (): OpenAI => {
  if (!client) {
    client = new OpenAI({ apiKey: Env.OPENAI_API_KEY });
  }

  return client;
};

export const OPENAI_MODEL = "gpt-4o-mini";
