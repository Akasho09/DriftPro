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
  variant?: "default" | "outlined" | "gradient" | "fancy";
}): JSX.Element {
  const baseClasses =
    "rounded-2xl p-6 shadow-md transition-all duration-300 relative overflow-hidden";

  const variants: Record<string, string> = {
    default: "bg-white hover:shadow-lg border border-gray-200",
    outlined: "bg-white border-2 border-gray-300 hover:border-blue-500",
    gradient:
      "bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-xl",
    fancy:
      "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-500",
  };

  // Add animated gradient overlay for 'fancy' variant
  const fancyOverlay =
    variant === "fancy"
      ? "absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-30 animate-gradient-x rounded-2xl pointer-events-none"
      : "";

  return (
    <div className={clsx(baseClasses, variants[variant], className)}>
      {fancyOverlay && <div className={fancyOverlay}></div>}

      {/* Header */}
      <div className="mb-4 relative z-10">
        <h3
          className={clsx(
            "text-xl font-semibold",
            variant === "gradient" || variant === "fancy"
              ? "text-white"
              : "text-gray-800"
          )}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className={clsx(
              "mt-1 text-sm",
              variant === "gradient" || variant === "fancy"
                ? "text-gray-100"
                : "text-gray-500"
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="space-y-4 relative z-10">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="mt-6 border-t pt-4 relative z-10">{footer}</div>
      )}
    </div>
  );
}
