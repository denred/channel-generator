"use client";

import { useState, memo } from "react";

import { AnalysisTab } from "@/libs/enums/analysisTab";
import type { AnalyzeChannelResponse } from "@/types/analysis";

import ChannelInfo from "./components/ChannelInfo";
import TabContent from "./components/TabContent";
import TabNavigation from "./components/TabNavigation";

export default memo(function AnalysisResult({ data }: { data: AnalyzeChannelResponse }) {
  const [activeTab, setActiveTab] = useState<AnalysisTab>(AnalysisTab.IDEAS);

  const tabs: Array<{ id: AnalysisTab; label: string; icon: string; count: number }> = [
    { id: AnalysisTab.IDEAS, label: "Ideas", icon: "💡", count: data.ideas?.length ?? 0 },
    {
      id: AnalysisTab.TOPICS,
      label: "Topics",
      icon: "🎯",
      count: data.topics?.topics?.length ?? 0,
    },
    { id: AnalysisTab.NEWS, label: "News", icon: "📰", count: data.news?.length ?? 0 },
    { id: AnalysisTab.REDDIT, label: "Reddit", icon: "💬", count: data.reddit?.length ?? 0 },
    { id: AnalysisTab.VIDEOS, label: "Videos", icon: "🎬", count: data.lastVideos?.length ?? 0 },
  ];

  return (
    <section className="mt-6 space-y-6 md:mt-8 md:space-y-10">
      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <TabContent activeTab={activeTab} data={data} />
      <ChannelInfo channelId={data.channelId} channelName={String(data.channelName)} />
    </section>
  );
});
