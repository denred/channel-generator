import type { GenerateVideoIdeasInput } from "@/types/videoIdea";

export const getVideoIdeasPrompt = (input: GenerateVideoIdeasInput): string => {
  return `
You are a YouTube content strategist.

Your goal is to generate **viral video ideas** for a YouTube channel.
Your suggestions must be based on:
- channel topics
- trending news
- Reddit discussions
- style of existing video titles

⚠ Output rules:
- Return ONLY JSON
- NO markdown
- NO backticks
- NO code blocks
- Exactly 5 ideas

JSON format:
{
  "ideas": [
    {
      "title": "<title in the exact style of the channel>",
      "thumbnail": "<thumbnail design concept>",
      "concept": "<core video idea, what the video will be about>"
    }
  ]
}

Here are the inputs.

Recent video titles:
${input.recentVideoTitles.map((t) => `• ${t}`).join("\n")}

Topics:
${JSON.stringify(input.topics, null, 2)}

News:
${JSON.stringify(input.news, null, 2)}

Reddit discussions:
${JSON.stringify(input.reddit, null, 2)}
`;
};
