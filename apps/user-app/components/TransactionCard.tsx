"use client";

import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

interface TransactionCardProps {
  title: string;
  subtitle?: string;
  amount: number;
  date: string | Date;
  status?: "Success" | "Failure" | "Processing";
  isSent?: boolean;
  receiverOrSender?: string;
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
    typeof date === "string" ? new Date(date).toLocaleString("en-IN") : date.toLocaleString("en-IN");

  // Choose color scheme based on type
  const isMoneyFlow = typeof isSent === "boolean";
  let bgClass = "";
  let textColor = "";
  let amountSign = "";

  if (isMoneyFlow) {
    bgClass = isSent ? "bg-green-50 border-green-200" : "bg-pink-50 border-pink-200";
    textColor = isSent ? "text-green-700" : "text-pink-700";
    amountSign = isSent ? "-" : "+";
  } else {
    bgClass = "bg-white/80 border-gray-200";
  }

  // For Add Money page (status-based)
  let statusIcon;
  if (status === "Success") statusIcon = <FaCheckCircle className="text-green-600" />;
  else if (status === "Failure") statusIcon = <FaTimesCircle className="text-pink-500" />;
  else if (status === "Processing") statusIcon = <FaClock className="text-black" />;

  return (
    <div
      className={`p-5 border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center ${bgClass}`}
    >
      {/* Left Section */}
      <div>
        <div className="font-semibold text-black">
          {isMoneyFlow
            ? isSent
              ? `Sent To: ${receiverOrSender ?? "Unknown"}`
              : `Received From: ${receiverOrSender ?? "Unknown"}`
            : `₹${amount.toFixed(2)} via ${title}`}
        </div>
        <div className="text-xs text-black/50">{formattedDate}</div>
        {!isMoneyFlow && <div className="text-sm text-black/70">{subtitle}</div>}
      </div>

      {/* Right Section */}
      {isMoneyFlow ? (
        <div className={`text-lg font-bold ${textColor}`}>
          {amountSign} ₹{amount.toFixed(2)}
        </div>
      ) : (
        status && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-white/60 border border-gray-200">
            {statusIcon}
            {status}
          </div>
        )
      )}
    </div>
  );
}
