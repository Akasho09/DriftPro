import { Card } from "@repo/ui/card";
import search from "../lib/recentTrans";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import redis from "../lib/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

type Transaction = {
  amount: number;
  provider: string;
  startTime: string | Date;
  status: "Success" | "Failure" | "Processing";
};

interface ReTrProps {
  n: number;
}

export default async function AddMoneyTransactions({ n }: ReTrProps) {
  const session = await getServerSession(authOptions)
  const CACHE_KEY = `${session?.user.id}addMoney`;

  let data: Transaction[] | null = null;
  const cached = await redis.get(CACHE_KEY)
  if(cached){
    data = JSON.parse(cached);
  }else {
    data = await search();
  }

  if (!data || data.length === 0) {
    return (
      <Card
        title="💳 Add Money Transactions"
        className="p-4 shadow-md rounded-xl m-4 max-w-md mx-auto"
      >
        <p className="text-gray-500 text-center">No recent transactions found.</p>
      </Card>
    );
  }

  const limit = n === 0 ? 4 : data.length;
      
  return (
    <div className="w-full flex justify-center items-center px-4">
      <Card
        title="💳 Add Money Transactions"
        className="p-6 shadow-md rounded-2xl max-w-xl w-full bg-white/90 backdrop-blur-sm border border-green-200"
      >
        <div className="space-y-4">
          {data.slice(0, limit).map((d: Transaction, index: number) => {
            const date = new Date(d.startTime);

            let statusIcon;
            let statusClass;
            if (d.status === "Success") {
              statusIcon = <FaCheckCircle className="text-green-600" />;
              statusClass = "bg-green-50 text-green-800";
            } else if (d.status === "Failure") {
              statusIcon = <FaTimesCircle className="text-pink-500" />;
              statusClass = "bg-pink-50 text-pink-700";
            } else {
              statusIcon = <FaClock className="text-black" />;
              statusClass = "bg-black/10 text-black";
            }

            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 bg-white/80`}
              >
                {/* Left side */}
                <div className="mb-3 md:mb-0">
                  <div className="text-lg font-bold text-black">
                    ₹{d.amount.toFixed(2)}
                  </div>
                  <div className="text-sm text-black/70">{d.provider}</div>
                  <div className="text-xs text-black/40">
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
    </div>
  );
}
