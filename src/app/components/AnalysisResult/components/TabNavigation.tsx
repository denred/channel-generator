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
    <div className="sticky top-0 z-20 bg-transparent pb-3 backdrop-blur-md">
      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white/70 p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "group relative flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
              )}
            >
              <span className="text-lg opacity-80">{tab.icon}</span>
              {tab.label}

              <span
                className={clsx(
                  "rounded-full px-2 py-0.5 text-xs transition-colors",
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
