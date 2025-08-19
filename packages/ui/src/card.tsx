import { type JSX, ReactNode } from "react";
import clsx from "clsx";

export function Card({
  className,
  title,
  subtitle,
  children,
  footer,
  variant = "default",
}: {
  className?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
  variant?: "default" | "outlined" | "gradient";
}): JSX.Element {
  const baseClasses =
    "rounded-2xl p-6 shadow-md transition-all duration-300";
  
  const variants: Record<string, string> = {
    default: "bg-white hover:shadow-lg border border-gray-200",
    outlined: "bg-white border-2 border-gray-300 hover:border-blue-500",
    gradient:
      "bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-xl",
  };

  return (
    <div className={clsx(baseClasses, variants[variant], className)}>
      {/* Header */}
      <div className="mb-4">
        <h3
          className={clsx(
            "text-xl font-semibold",
            variant === "gradient" ? "text-white" : "text-gray-800"
          ) }
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className={clsx(
              "mt-1 text-sm",
              variant === "gradient" ? "text-gray-100" : "text-gray-500"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="space-y-4">{children}</div>

      {/* Footer */}
      {footer && <div className="mt-6 border-t pt-4">{footer}</div>}
    </div>
  );
}