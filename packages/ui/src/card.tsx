import { type ReactNode } from "react";

interface CardProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
}

export function Card({
  title,
  subtitle,
  children,
  footer,
  icon,
}: CardProps) {

  return (
    <div className="bg-gradient-to-r from-black via-zinc-800 to-yellow-500 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
      <div className="mb-4 flex items-center gap-3">
        {icon && <div>{icon}</div>}
        <div>
          <h3 >
            {title}
          </h3>
          {subtitle && <p className="">{subtitle}</p>}
        </div>
      </div>

      <div>{children}</div>

      {footer && <div className="mt-6 border-t pt-4">{footer}</div>}
    </div>
  );
}


export function Card2({
  title,
  subtitle,
  children,
  footer,
  icon,
}: CardProps) {

  return (
    <div className="bg-gradient-to-l from-black via-zinc-800 to-yellow-500 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
      <div className="mb-4 flex items-center gap-3">
        {icon && <div>{icon}</div>}
        <div>
          <h3 >
            {title}
          </h3>
          {subtitle && <p className="">{subtitle}</p>}
        </div>
      </div>

      <div>{children}</div>

      {footer && <div className="mt-6 border-t pt-4">{footer}</div>}
    </div>
  );
}
