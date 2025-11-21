"use client";

import clsx from "clsx";

import type { AnalysisTab } from "@/libs/enums/analysisTab";

interface Tab {
  id: AnalysisTab;
  label: string;
  icon: string;
  count: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: AnalysisTab;
  onTabChange: (tabId: AnalysisTab) => void;
}

const TabNavigation = ({ tabs, activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="sticky top-14 z-20 -mx-4 bg-gray-50 pb-3 backdrop-blur-md md:top-0 md:mx-0 md:bg-transparent dark:bg-gray-900">
      <nav className="scrollbar-hide flex gap-1 overflow-x-auto px-4 md:rounded-xl md:border md:border-gray-200 md:bg-white/70 md:p-1 md:px-0 md:shadow-sm md:dark:border-gray-700 md:dark:bg-gray-800/70">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "group relative flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-all md:gap-2 md:rounded-none md:px-4",
                isActive
                  ? "bg-white text-blue-600 shadow-sm md:bg-transparent md:shadow-none dark:bg-gray-800 dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
              )}
            >
              <span className="text-base opacity-80 md:text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>

              <span
                className={clsx(
                  "rounded-full px-1.5 py-0.5 text-xs transition-colors md:px-2",
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
                )}
              >
                {tab.count}
              </span>

              <span
                className={clsx(
                  "absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-400",
                  isActive && "w-3/4",
                )}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default TabNavigation;
