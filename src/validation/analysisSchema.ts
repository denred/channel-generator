import { z } from "zod";

import { ErrorMessages } from "@/libs/constants/errorMessages";

const URL_IDENTIFIER = ["youtube.com", "youtube.com/@"];
const MIN_CHANNEL_URL_LENGTH = 1;

export const analysisSchema = z.object({
  channelUrl: z
    .string()
    .min(MIN_CHANNEL_URL_LENGTH, { message: ErrorMessages.YOUTUBE_CHANNEL_REQUIRED })
    .pipe(z.url({ message: ErrorMessages.INVALID_CHANNEL_URL }))
    .refine((value) => URL_IDENTIFIER.some((v) => value.includes(v)), {
      message: ErrorMessages.INVALID_YOUTUBE_CHANNEL,
    }),
});

export type AnalysisFormValues = z.infer<typeof analysisSchema>;
