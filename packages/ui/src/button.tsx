"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  onClick,
  type = "button",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) => {
  const baseStyles =
    "text-white border border-white rounded-md font-medium focus:outline-none focus:ring-2 transition-all flex items-center justify-center bg-gradient-to-r from-black via-zinc-800 to-yellow-500 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-black";


  const sizeStyles: Record<typeof size, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        fullWidth && "w-full",
        (disabled || loading) && "opacity-50 cursor-not-allowed",
      )}
    >
      {loading ? (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
      ) : (
        children
      )}
    </button>
  );
};

