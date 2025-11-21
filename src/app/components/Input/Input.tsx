"use client";

import clsx from "clsx";
import { useController, type Control, type FieldValues, type Path } from "react-hook-form";
import { FiX } from "react-icons/fi";

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

  const handleClear = () => {
    field.onChange("");
  };

  return (
    <div className={clsx("flex w-full flex-col", className)}>
      <div className="relative">
        <input
          {...field}
          placeholder={placeholder}
          className={clsx(
            "w-full rounded-full bg-[#f1f1f1] px-5 py-3 text-[15px] text-black shadow-sm transition-all",
            "placeholder:text-gray-500 hover:bg-[#ececec] focus:ring-1 focus:ring-[#065fd4] focus:outline-none",
            error && "border border-red-500",
            field.value && "pr-12",
          )}
        />
        {field.value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-gray-500 transition-all hover:bg-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
            aria-label="Clear input"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
