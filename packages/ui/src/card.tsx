import { type JSX } from "react";

export function Card({
  className,
  title,
  children,
}: {
  className?: string;
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className={` rounded-lg shadow-md border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
      <div>{children}</div>
    </div>
  );
}
