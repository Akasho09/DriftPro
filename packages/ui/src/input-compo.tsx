"use client"; 
import { ReactNode } from "react";

interface InputCompoProps {
  children?: ReactNode;
  inputtype: "text" | "number" | "email" | "password" | "tel"; // Restrict to valid types
  label?: string;
  className?: string;
  onChange: (value: (string | number)) => void;
}

export const InputCompo = ({ 
  children,
  inputtype,
  label,
  className = "",
  onChange
}: InputCompoProps) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && <label className="text-gray-700 font-medium">{label}</label>}
      <input 
        type={inputtype} 
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
        onChange={(e) => onChange(e.target.value)}
      />
      {children}
    </div>
  );
};