"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  size?: "xs"|"sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string; 
}

export const Button = ({
  children,
  onClick,
  type = "button",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "bg-gradient-to-r from-black via-zinc-800 to-yellow-500",
}: ButtonProps) => {
  const baseStyles =
    "text-white border border-white rounded-md font-medium focus:outline-none focus:ring-2 transition-all flex items-center justify-center hover:from-yellow-500 hover:to-black";

  const sizeStyles: Record<typeof size, string> = {
    xs: "px-2 py-1 text-xs",
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
        className
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
