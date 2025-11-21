"use client";

export default function StepsProgress({
  steps,
  activeStep,
}: {
  steps: { label: string; done: boolean }[];
  activeStep: number;
}) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div
          key={step.label}
          className={`flex items-center gap-3 transition-all ${
            step.done ? "text-green-600" : index === activeStep ? "text-blue-600" : "text-gray-500"
          }`}
        >
          <span className="w-4">{step.done ? "✔" : index === activeStep ? "⏳" : ""}</span>
          <span>{step.label}</span>
        </div>
      ))}
    </div>
  );
}
