"use client";

import { useAnalyzeChannel } from "@/hooks/useAnalyzeChannel";
import { RequestStatus } from "@/libs/enums/requestStatus";

import AnalysisForm from "./components/AnalysisForm/AnalysisForm";
import AnalysisResult from "./components/AnalysisResult/AnalysisResult";
import StepsProgress from "./components/StepsProgress/StepsProgress";

export default function HomePage() {
  const { status, steps, result, error, loading, startAnalysis } = useAnalyzeChannel();

  return (
    <main className="mx-auto max-w-3xl space-y-8 py-12">
      <AnalysisForm onSubmit={startAnalysis} isLoading={loading} />

      <StepsProgress steps={steps} activeStep={steps.findIndex((s) => s.done === false)} />

      {error && <p className="font-medium text-red-500">{error}</p>}

      {status === RequestStatus.SUCCESS && result && <AnalysisResult data={result} />}
    </main>
  );
}
