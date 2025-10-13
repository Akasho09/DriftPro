import { Card } from "@repo/ui/card";
import ts from "../lib/p2ptrans";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import redis from "../lib/redis";

export interface Transaction {
  amount: number;
  id: number;
  senderId: string;
  receiverId: string;
  recMobile?: string | null;
  sendMobile?: string | null;
  tTime: string | Date | null;
}

export default async function SendTransactions() {
  const session = await getServerSession(authOptions);

  let data: Transaction[] | null = null;
  const CACHE_KEY = `${session?.user.id}sendMoney`;
  const cached = await redis.get(CACHE_KEY);

  if(cached){
    data = JSON.parse(cached);
  }else {
    data = await ts();
  }

  return (
    <div className="w-full flex justify-center items-center px-4">
      <Card
        className="w-full max-w-xl p-6 shadow-md rounded-2xl bg-white/90 backdrop-blur-sm border border-green-200"
        title="📑 Send/Receive Transactions"
      >
        <p className="text-sm text-black/70 mb-4 text-center">
          View your recent send & receive history
        </p>

        {!session?.user ? (
          <p className="text-red-500 font-semibold text-center p-4">
            ⚠️ Login First
          </p>
        ) : !data || data.length === 0 ? (
          <p className="text-black/50 text-center p-4">No transactions found.</p>
        ) : (
          <div className="space-y-4">
            {data.map((d: Transaction) => {
              const isSent = d.senderId === session?.user?.id;
              const timeString = d.tTime ? new Date(d.tTime).toLocaleString("en-IN") : "N/A";

              const bgClass = isSent ? "bg-green-50 border-green-200 text-green-800" : "bg-pink-50 border-pink-200 text-pink-700";
              const amountSign = isSent ? "-" : "+";
              const amountColor = isSent ? "text-green-700" : "text-pink-700";

              return (
                <div
                  key={d.id}
                  className={`p-5 border rounded-xl shadow-sm flex justify-between items-center ${bgClass} hover:shadow-md transition-all duration-300`}
                >
                  {/* Left Section */}
                  <div>
                    <div className={`font-semibold ${isSent ? "text-green-600" : "text-pink-600"}`}>
                      {isSent
                        ? `Sent To: ${d.recMobile ?? "Unknown"}`
                        : `Received From: ${d.sendMobile ?? "Unknown"}`}
                    </div>
                    <div className="text-sm text-black/50">{timeString}</div>
                  </div>

                  {/* Right Section */}
                  <div className={`text-lg font-bold ${amountColor}`}>
                    {amountSign} ₹{d.amount.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
