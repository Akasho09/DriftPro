"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onclick: Function
}

export const Button = ({ children, className, onclick }: ButtonProps) => {
  return (
    <button
      className={className}
      onClick={()=>{
        onclick()
      }}
    >
      {children}
    </button>
  );
};
