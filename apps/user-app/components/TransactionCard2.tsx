"use client";

import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

interface TransactionCardProps {
  title: string;
  subtitle?: string;
  amount: number;
  date: null | Date | string;
  status?: "Success" | "Failure" | "Processing";
  isSent?: boolean;
  receiverOrSender?: string | null;
}

export default function TransactionCard({
  title,
  subtitle,
  amount,
  date,
  status,
  isSent,
  receiverOrSender,
}: TransactionCardProps) {
  const formattedDate =
    typeof date === "string"
      ? new Date(date).toLocaleString("en-IN")
      : date?.toLocaleString("en-IN");

  const isMoneyFlow = typeof isSent === "boolean";

  const bgClass = isMoneyFlow
    ? isSent
      ? "bg-gradient-to-br from-green-50 to-white border-green-200"
      : "bg-gradient-to-br from-pink-50 to-white border-pink-200"
    : "bg-white/70 border-gray-200 backdrop-blur-xl";

  const amountColor = isSent ? "text-red-600" : "text-green-700";
  const amountSign = isSent ? "-" : "+";

  const statusIcon =
    status === "Success" ? (
      <FaCheckCircle className="text-green-600 text-lg" />
    ) : status === "Failure" ? (
      <FaTimesCircle className="text-pink-500 text-lg" />
    ) : status === "Processing" ? (
      <FaClock className="text-amber-600 text-lg animate-pulse" />
    ) : null;

  return (
    <div
      className={`
        p-5 border rounded-2xl w-full
        shadow-sm hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]
        transition-all duration-300
        ${bgClass}
      `}
    >
      <div className="flex items-center justify-between gap-4 w-full">
        
        {/* LEFT SIDE (fixed width) */}
        <div className="flex flex-col gap-1 w-[65%]">
          <div className="font-semibold text-black break-words">
            {isMoneyFlow ? (
              isSent ? (
                <>Sent To: <span className="text-pink-700">{receiverOrSender ?? "Unknown"}</span></>
              ) : (
                <>Received From: <span className="text-green-700">{receiverOrSender ?? "Unknown"}</span></>
              )
            ) : (
              <>₹{amount.toFixed(2)} via <span className="text-pink-500">{title}</span></>
            )}
          </div>

          <div className="text-xs text-black/50">{formattedDate}</div>

          {!isMoneyFlow && subtitle && (
            <div className="text-sm text-black/70">{subtitle}</div>
          )}
        </div>

        {/* RIGHT SIDE (fixed width) */}
        <div className="w-[35%] flex justify-end">
          {isMoneyFlow ? (
            <div className={`text-lg font-bold ${amountColor} text-right`}>
              {amountSign} ₹{amount.toFixed(2)}
            </div>
          ) : (
            status && (
              <div
                className="
                flex items-center gap-2 px-3 py-1 rounded-full
                text-sm font-medium text-black border border-gray-200
                backdrop-blur-md shadow-sm">
                {statusIcon}
                {status}
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}
