"use client";

import React from "react";

interface DropDownProps {
  children?: React.ReactNode;
  title: string;
  items: string[];
  className?: string;
  onSelect: (value: string) => void;
  defaultValue?: string;
}

export const DropDown: React.FC<DropDownProps> = ({
  children,
  title,
  items,
  className = "",
  onSelect,
  defaultValue,
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="font-semibold text-gray-700">{title}</label>
      <select
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        onChange={(e) => onSelect(e.target.value)}
        defaultValue={defaultValue || items[0]}
      >
        {items.map((item, index) => (
          <option value={item} key={index}>
            {item}
          </option>
        ))}
      </select>
      {children && <div>{children}</div>}
    </div>
  );
};
