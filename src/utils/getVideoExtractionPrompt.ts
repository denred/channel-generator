import type { VideoData } from "@/types/videoData";

export const getVideoExtractionPrompt = (videos: VideoData[]): string => {
  return `
## You are an expert content analyst.

## Extract the main content topics based on YouTube video titles and descriptions.

## OUTPUT RULES — FOLLOW STRICTLY:
- Return ONLY JSON
- NO markdown
- NO commentary
- NO backticks
- NO code blocks
- NO explanation text

## Output format (strict):
{
  "topics": [
    {
      "topic": "<topic name>",
      "confidence": <0-100>,
      "relatedVideos": ["video title 1", "video title 2"]
    }
  ]
}

## Videos:
${videos.map((v) => `• Title: "${v.title}" • Description: "${v.description}"`).join("\n")}
`;
};
