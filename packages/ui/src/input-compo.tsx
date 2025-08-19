"use client";
import { ReactNode } from "react";

interface InputCompoProps {
  children?: ReactNode;
  inputtype: "text" | "number" | "email" | "password" | "tel";
  label?: string;
  placeholder?: string;
  value?: string | number;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  className?: string;
  error?: string; // show validation error
  onChange: (value: string | number) => void;
}

export const InputCompo = ({
  children,
  inputtype,
  label,
  placeholder,
  value,
  required = false,
  disabled = false,
  min,
  max,
  className = "",
  error,
  onChange,
}: InputCompoProps) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className="text-gray-700 font-medium text-sm">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input */}
      <input
        type={inputtype}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        className={`border rounded-lg px-3 py-2 text-sm transition-all 
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"} 
          ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"} 
          focus:outline-none focus:ring-2`}
        onChange={(e) => onChange(inputtype === "number" ? Number(e.target.value) : e.target.value)}
      />

      {/* Error Message */}
      {error && <span className="text-sm text-red-500">{error}</span>}

      {children}
    </div>
  );
};
