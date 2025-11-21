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
      const res = await fetch(ApiRoutes.ANALYZE_CHANNEL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const reader = res.body?.getReader();
      let stepIndex = 0;

      if (reader) {
        while (true) {
          const { done } = await reader.read();
          if (done) {
            break;
          }

          setSteps((prev) => prev.map((s, i) => (i === stepIndex ? { ...s, done: true } : s)));

          stepIndex++;
        }
      }

      const json = (await res.json()) as AnalyzeChannelResponse;
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
