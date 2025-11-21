"use client";

import { useState } from "react";

import { useAnalyzeChannel } from "@/hooks/useAnalyzeChannel";
import { RequestStatus } from "@/libs/enums/requestStatus";

import AnalysisForm from "./components/AnalysisForm/AnalysisForm";
import AnalysisResult from "./components/AnalysisResult/AnalysisResult";
import ExampleUrls from "./components/ExampleUrls/ExampleUrls";
import StepsProgress from "./components/StepsProgress/StepsProgress";

export default function HomePage() {
  const { status, steps, result, error, loading, startAnalysis, reset } = useAnalyzeChannel();
  const [setUrlCallback, setSetUrlCallback] = useState<((url: string) => void) | null>(null);

  const activeStep = steps.findIndex((s) => !s.done);

  const handleSelectUrl = (url: string) => {
    if (setUrlCallback) {
      setUrlCallback(url);
    }
  };

  const handleUrlChange = (setValue: (value: string) => void) => {
    setSetUrlCallback(() => setValue);
  };

  const handleNewAnalysis = () => {
    reset();
    if (setUrlCallback) {
      setUrlCallback("");
    }
  };

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-12">
      <header className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-red-500 to-pink-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
          <span>🎬</span>
          <span>AI-Powered Content Strategy</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          YouTube Channel Analyzer
        </h1>
        <p className="mx-auto max-w-2xl text-base text-gray-600">
          Paste a YouTube channel URL and let AI analyze recent videos, trending topics, and
          generate data-driven content ideas for your next viral video.
        </p>
      </header>

      <AnalysisForm onSubmit={startAnalysis} isLoading={loading} onUrlChange={handleUrlChange} />

      {!loading && !result && <ExampleUrls onSelectUrl={handleSelectUrl} />}

      {status !== RequestStatus.IDLE && (
        <StepsProgress steps={steps} activeStep={activeStep >= 0 ? activeStep : steps.length - 1} />
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="font-medium text-red-600">{error}</p>
          <button
            onClick={handleNewAnalysis}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {status === RequestStatus.SUCCESS && result && (
        <>
          <div className="flex justify-center">
            <button
              onClick={handleNewAnalysis}
              className="cursor-pointer rounded-lg border-2 border-blue-600 bg-white px-6 py-2.5 font-medium text-blue-600 transition-all hover:bg-blue-50"
            >
              ✨ Analyze Another Channel
            </button>
          </div>
          <AnalysisResult data={result} />
        </>
      )}
    </main>
  );
}
