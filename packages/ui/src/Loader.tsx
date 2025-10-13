"use client";
import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  color = "text-indigo-600",
  fullScreen = false,
  className = "",
}) => {
  const sizeClasses =
    size === "sm"
      ? "h-4 w-4 border-2"
      : size === "lg"
      ? "h-12 w-12 border-4"
      : "h-8 w-8 border-3";

  const spinner = (
    <div
      className={`animate-spin rounded-full border-t-transparent border-solid ${sizeClasses} ${color} border-current ${className}`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};
