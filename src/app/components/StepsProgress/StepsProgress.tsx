"use client";

export default function StepsProgress({
  steps,
  activeStep,
}: {
  steps: { label: string; done: boolean }[];
  activeStep: number;
}) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isDone = step.done;

        return (
          <div
            key={step.label}
            className={`flex items-center gap-3 transition-all duration-300 ${
              isDone ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <div className="relative flex h-6 w-6 items-center justify-center">
              {isDone ? (
                <svg
                  className="animate-in zoom-in h-6 w-6 duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : isActive ? (
                <div className="relative">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                </div>
              ) : (
                <div className="h-2 w-2 rounded-full bg-gray-300" />
              )}
            </div>
            <span className={`font-medium ${isActive ? "text-base" : "text-sm"}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
