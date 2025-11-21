"use client";

import clsx from "clsx";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";

interface Props<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  className?: string;
}

export const Input = <T extends FieldValues>({
  name,
  control,
  placeholder,
  className,
}: Props<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <div className={clsx("flex w-full flex-col", className)}>
      <input
        {...field}
        placeholder={placeholder}
        className={clsx(
          "w-full rounded-full bg-[#f1f1f1] px-5 py-3 text-[15px] text-black shadow-sm transition-all",
          "placeholder:text-gray-500 hover:bg-[#ececec] focus:ring-1 focus:ring-[#065fd4] focus:outline-none",
          error && "border border-red-500",
        )}
      />
    </div>
  );
};

export default Input;
