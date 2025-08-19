import { Card } from "@repo/ui/card";
import search from "../lib/recentTrans";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

type Transaction = {
  amount: number;
  provider: string;
  startTime: string | Date;
  status: "Success" | "Failure" | "Processing";
};

interface ReTrProps {
  n: number;
}

export default async function ReTr({ n }: ReTrProps) {
  const data = await search(); // type: Transaction[] | null

  if (!data || data.length === 0) {
    return (
      <Card
        title="💳 Add Money Transactions"
        className="p-4 shadow-md rounded-xl bg-white m-4"
      >
        <p className="text-gray-500 text-center">
          No recent transactions found.
        </p>
      </Card>
    );
  }

  // if n=0 → show 4, else → show all
  const limit = n === 0 ? 4 : data.length;

  return (
    <Card
      title="💳 Add Money Transactions"
      className="p-6 shadow-md rounded-2xl bg-white"
    >
      <div className="space-y-4">
        {data.slice(0, limit).map((d: Transaction, index: number) => {
          const date = new Date(d.startTime);

          let statusIcon;
          let statusClass;
          if (d.status === "Success") {
            statusIcon = <FaCheckCircle className="text-green-500" />;
            statusClass = "bg-green-100 text-green-700";
          } else if (d.status === "Failure") {
            statusIcon = <FaTimesCircle className="text-red-500" />;
            statusClass = "bg-red-100 text-red-700";
          } else {
            statusIcon = <FaClock className="text-yellow-500" />;
            statusClass = "bg-yellow-100 text-yellow-700";
          }

          return (
            <div
              key={index}
              className="flex justify-between items-center p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              {/* Left side */}
              <div>
                <div className="text-lg font-bold text-gray-800">
                  ₹{d.amount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  {d.provider}
                </div>
                <div className="text-xs text-gray-400">
                  {date.toLocaleDateString()} {date.toLocaleTimeString()}
                </div>
              </div>

              {/* Right side - Status */}
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}
              >
                {statusIcon}
                {d.status}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
