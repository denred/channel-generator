"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { analysisSchema, type AnalysisFormValues } from "@/validation/analysisSchema";

import Input from "../Input/Input";
import SubmitButton from "../SubmitButton/SubmitButton";

const AnalysisForm = ({
  onSubmit,
  isLoading,
  initialUrl = "",
  onUrlChange,
}: {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
  initialUrl?: string;
  onUrlChange?: (setValue: (value: string) => void) => void;
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisSchema),
    defaultValues: { channelUrl: initialUrl },
  });

  const handleFormSubmit = (data: AnalysisFormValues) => {
    void onSubmit(data.channelUrl);
  };

  useEffect(() => {
    const handleSetUrl = (url: string) => {
      setValue("channelUrl", url);
    };

    if (onUrlChange) {
      onUrlChange(handleSetUrl);
    }
  }, [onUrlChange, setValue]);

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit(handleFormSubmit)(e);
        }}
        className="flex w-full flex-row items-center gap-2"
      >
        <Input
          className="flex-1"
          name="channelUrl"
          control={control}
          placeholder="Search YouTube channel..."
          disabled={isLoading}
        />

        <SubmitButton isLoading={isLoading} />
      </form>

      {errors.channelUrl && (
        <p className="mt-2 text-sm font-medium text-red-500">{errors.channelUrl.message}</p>
      )}
    </div>
  );
};

export default AnalysisForm;
export type { AnalysisFormValues };
