"use client";

import clsx from "clsx";
import { BiSearch } from "react-icons/bi";

interface Props {
  isLoading: boolean;
  icon?: React.ReactNode;
  text?: string;
  className?: string;
}

const SubmitButton = ({ isLoading, icon = <BiSearch size={22} />, text, className }: Props) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={clsx(
        "flex h-12 min-w-20 cursor-pointer items-center justify-center rounded-full bg-red-500 px-6 text-white shadow transition-all",
        "hover:bg-red-600 active:scale-[0.97] disabled:opacity-40",
        className,
      )}
    >
      {isLoading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-white border-t-transparent" />
      ) : text ? (
        text
      ) : (
        icon
      )}
    </button>
  );
};

export default SubmitButton;
