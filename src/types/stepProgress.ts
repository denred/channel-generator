import type { AnalysisStep } from "@/libs/enums/analysisStep";

export type StepProgress = {
  label: AnalysisStep;
  done: boolean;
};
