"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { analysisSchema, type AnalysisFormValues } from "@/validation/analysisSchema";

import Input from "../Input/Input";
import SubmitButton from "../SubmitButton/SubmitButton";

const AnalysisForm = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisSchema),
    defaultValues: { channelUrl: "" },
  });

  const handleFormSubmit = (data: AnalysisFormValues) => {
    void onSubmit(data.channelUrl);
  };

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
