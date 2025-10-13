import { type ReactNode } from "react";
import clsx from "clsx";

type CardVariant = "default" | "outlined" | "gradient" | "fancy";

interface CardProps {
  className?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
  variant?: CardVariant;
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function Card({
  className,
  title,
  subtitle,
  children,
  footer,
  variant = "default",
  icon,
  fullWidth = false,
}: CardProps) {
  const variants: Record<CardVariant, string> = {
    default: "bg-[#ebe6e6] border border-gray-200 hover:shadow-lg",
    outlined: "bg-white border-2 border-gray-300 hover:border-blue-500",
    gradient: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-xl",
    fancy: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all",
  };

  return (
    <div className={clsx("rounded-2xl p-6 shadow-md relative overflow-hidden", variants[variant], fullWidth && "w-full", className)}>
      <div className="mb-4 flex items-center gap-3">
        {icon && <div>{icon}</div>}
        <div>
          <h3 className={clsx("text-xl font-semibold", variant === "gradient" || variant === "fancy" ? "text-white" : "text-gray-800")}>
            {title}
          </h3>
          {subtitle && <p className={clsx("mt-1 text-sm", variant === "gradient" || variant === "fancy" ? "text-gray-100" : "text-gray-500")}>{subtitle}</p>}
        </div>
      </div>

      <div>{children}</div>

      {footer && <div className="mt-6 border-t pt-4">{footer}</div>}
    </div>
  );
}
