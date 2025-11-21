import { AnalysisTab } from "@/libs/enums/analysisTab";
import type { AnalyzeChannelResponse } from "@/types/analysis";

import NewsTab from "./NewsTab";
import RedditTab from "./RedditTab";
import TopicsTab from "./TopicsTab";
import VideoIdeasTab from "./VideoIdeasTab";
import VideosTab from "./VideosTab";

interface TabContentProps {
  activeTab: AnalysisTab;
  data: AnalyzeChannelResponse;
}

export default function TabContent({ activeTab, data }: TabContentProps) {
  switch (activeTab) {
    case AnalysisTab.IDEAS:
      return <VideoIdeasTab ideas={data.ideas} />;
    case AnalysisTab.TOPICS:
      return <TopicsTab topics={data.topics} />;
    case AnalysisTab.NEWS:
      return <NewsTab news={data.news} />;
    case AnalysisTab.REDDIT:
      return <RedditTab reddit={data.reddit} />;
    case AnalysisTab.VIDEOS:
      return <VideosTab videos={data.lastVideos} />;
    default:
      return null;
  }
}
