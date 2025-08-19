import ts from "../lib/p2ptrans";
import { Card } from "@repo/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

interface Transaction {
  amount: number;
  id: number;
  fromNum: string;
  toNum: string;
  tTime: Date | null;
}

export default async function B() {
  const session = await getServerSession(authOptions);
  const data = await ts();

  return (
    <Card
      title="📑 Send/Recieve Transactions"
      subtitle="View your recent send & receive history"
      className="p-6 shadow-md rounded-xl bg-white"
    >
      {!session?.user?.email ? (
        <p className="text-red-500 font-semibold text-lg">⚠️ Login First</p>
      ) : !data || data.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="space-y-4">
          {data.map((d: Transaction) => {
            const isSent = d.fromNum === session.user?.email;
            return (
              <div
                key={d.id}
                className={`p-5 border rounded-xl shadow-sm flex justify-between items-center ${
                  isSent
                    ? "bg-blue-50 border-blue-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                {/* Left Section */}
                <div>
                  <div
                    className={`font-semibold ${
                      isSent ? "text-blue-600" : "text-green-600"
                    }`}
                  >
                    {isSent
                      ? `Sent To: ${d.toNum}`
                      : `Received From: ${d.fromNum}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    {d.tTime ? new Date(d.tTime).toLocaleString() : "N/A"}
                  </div>
                </div>

                {/* Right Section */}
                <div
                  className={`text-lg font-bold ${
                    isSent ? "text-blue-700" : "text-green-700"
                  }`}
                >
                  {isSent ? `- ₹${d.amount.toFixed(2)}` : `+ ₹${d.amount.toFixed(2)}`}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
