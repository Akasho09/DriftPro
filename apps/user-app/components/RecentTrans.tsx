import { Card } from "@repo/ui/card";
import search from "../lib/recentTrans";

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
  const data: Transaction[] = await search();

  // if n=0 → show 4, else → show all
  const limit = n === 0 ? 4 : data.length;

  if (!data || data.length === 0) {
    return (
      <Card title="Add Money Transactions" className="p-4 shadow-md rounded-xl bg-white m-4">
        <p className="text-gray-500 text-center">No recent transactions found.</p>
      </Card>
    );
  }

  return (
    <Card title="Add Money Transactions" className="p-6 shadow-md rounded-xl">
      <div className="space-y-4">
        {data.slice(0, limit).map((d, index) => (
          <div key={index} className="p-3 border-b rounded-lg bg-gray-50 shadow-sm">
            <div className="text-lg font-semibold">Amount: ₹{d.amount.toFixed(2)}</div>
            <div className="text-gray-700">Provider: {d.provider}</div>
            <div className="text-sm text-gray-500">
              Time: {new Date(d.startTime).toLocaleTimeString()}
            </div>
            <div
              className={
                d.status === "Success"
                  ? "text-green-500 font-semibold"
                  : "text-red-500 font-semibold"
              }
            >
              {d.status}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
