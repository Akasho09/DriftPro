import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

interface TransactionCardProps {
  amount: number;
  date: Date | string | null;
  isSent?: boolean;
  receiverOrSender?: string | null;
}

interface TransactionCardProps {
  title: string;  
  amount: number;
  date: Date | string | null;
  status?: "Success" | "Failure" | "Processing";
}


export function AddCard({
  title,
  amount,
  date,
  status,
}: TransactionCardProps) {
  const formattedDate =
    typeof date === "string"
      ? new Date(date).toLocaleString("en-IN")
      : date?.toLocaleString("en-IN") ?? "";

  // Detect Add Money transaction
  const bgClass =
    status === "Success"
      ? "bg-gradient-to-br from-green-50 to-white border-green-200"
      : status === "Failure"
      ? "bg-gradient-to-br from-pink-50 to-white border-pink-200"
      : status === "Processing"
      ? "bg-gradient-to-br from-yellow-50 to-white border-yellow-300"
      : "bg-white/70 border-gray-200 backdrop-blur-xl";

  const statusIcon =
    status === "Success" ? (
      <FaCheckCircle className="text-green-600 text-lg" />
    ) : status === "Failure" ? (
      <FaTimesCircle className="text-pink-500 text-lg" />
    ) : status === "Processing" ? (
      <FaClock className="text-amber-500 text-lg animate-pulse" />
    ) : null;

  return (
    <div
      className={`
        w-full p-5 border rounded-2xl
        shadow-sm hover:shadow-[0_4px_18px_rgba(0,0,0,0.09)]
        hover:-translate-y-0.5
        transition-all duration-300
        ${bgClass}
      `}
    >
      <div className="flex justify-between items-center">

        {/* LEFT — Provider & Date */}
        <div className="flex flex-col w-[70%]">
          <div className="font-semibold text-black">
            ₹{amount.toFixed(2)} via{" "}
            <span className="text-pink-600">{title}</span>
          </div>

          <div className="text-xs text-black/50 mt-1">{formattedDate}</div>
        </div>

        {/* RIGHT — Status Chip */}
        <div className="w-[30%] flex justify-end">
          <div
            className="
              flex items-center gap-2 px-3 py-1 rounded-full
              text-sm font-medium text-black
              border border-gray-200 backdrop-blur-md shadow-sm
            "
          >
            {statusIcon}
            {status}
          </div>
        </div>

      </div>
    </div>
  );
}


export function SendCard({
  amount,
  date,
  isSent,
  receiverOrSender,
}: TransactionCardProps) {
  const formattedDate =
    typeof date === "string"
      ? new Date(date).toLocaleString("en-IN")
      : date?.toLocaleString("en-IN");

  // Determine UI for Send / Receive
  const bgClass = isSent
    ? "bg-gradient-to-br from-red-50 to-white border-red-200"
    : "bg-gradient-to-br from-green-50 to-white border-green-200";

  const amountColor = isSent ? "text-red-600" : "text-green-700";
  const amountSign = isSent ? "-" : "+";

  return (
    <div
      className={`
        w-full p-5 border rounded-2xl
        shadow-sm hover:shadow-[0_3px_15px_rgba(0,0,0,0.06)]
        transition-all duration-300
        ${bgClass}
      `}
    >
      <div className="flex justify-between items-center">

        {/* LEFT: Person + Date */}
        <div className="flex flex-col w-[70%]">
          <div className="font-semibold text-black flex items-center gap-2">
            {isSent ? (
              <>
                <FaArrowUp className="text-red-500" /> 
                Sent To:
              </>
            ) : (
              <>
                <FaArrowDown className="text-green-600" />
                Received From:
              </>
            )}
            <span className="text-black/80">{receiverOrSender ?? "Unknown"}</span>
          </div>

          <div className="text-xs text-black/50 mt-1">{formattedDate}</div>
        </div>

        {/* RIGHT: Amount */}
        <div className="w-[30%] flex justify-end">
          <div className={`text-lg font-bold text-right ${amountColor}`}>
            {amountSign} ₹{amount.toFixed(2)}
          </div>
        </div>

      </div>
    </div>
  );
}
