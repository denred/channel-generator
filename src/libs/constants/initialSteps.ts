import type { StepProgress } from "@/types/stepProgress";

import { AnalysisStep } from "../enums/analysisStep";

export const INITIAL_STEPS: StepProgress[] = Object.values(AnalysisStep).map((label) => ({
  label,
  done: false,
}));
