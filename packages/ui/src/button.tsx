"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick: () => void;
}

export const Button = ({ children, className = "", onClick }: ButtonProps) => {
  return (
    <button
      className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition-all ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
