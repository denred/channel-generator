import { useState } from "react";

import { ApiRoutes } from "@/libs/constants/apiRoutes";
import { INITIAL_STEPS } from "@/libs/constants/initialSteps";
import { RequestStatus } from "@/libs/enums/requestStatus";
import type { AnalyzeChannelResponse } from "@/types/analysis";
import type { StepProgress } from "@/types/stepProgress";
import { getErrorResponse } from "@/utils/errorResponse";

export const useAnalyzeChannel = () => {
  const [steps, setSteps] = useState<StepProgress[]>(INITIAL_STEPS);
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.IDLE);
  const [result, setResult] = useState<AnalyzeChannelResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const loading = status === RequestStatus.LOADING;

  const startAnalysis = async (channelUrl: string) => {
    setStatus(RequestStatus.LOADING);
    setError(null);
    setResult(null);
    setSteps(INITIAL_STEPS);

    try {
      const progressInterval = setInterval(() => {
        setSteps((prev) => {
          const currentStepIndex = prev.findIndex((s) => !s.done);
          if (currentStepIndex !== -1 && currentStepIndex < prev.length - 1) {
            return prev.map((s, i) => (i === currentStepIndex ? { ...s, done: true } : s));
          }
          return prev;
        });
      }, 2000);

      const res = await fetch(ApiRoutes.ANALYZE_CHANNEL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl }),
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const errorData = (await res.json()) as { message?: string };
        throw new Error(errorData.message || `Request failed with status ${res.status}`);
      }

      const json = (await res.json()) as AnalyzeChannelResponse;

      setSteps((prev) => prev.map((s) => ({ ...s, done: true })));

      setResult(json);
      setStatus(RequestStatus.SUCCESS);
    } catch (err) {
      const { error } = getErrorResponse(err);
      setError(error);
      setStatus(RequestStatus.ERROR);
    }
  };

  return { status, steps, result, error, loading, startAnalysis };
};
