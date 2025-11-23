import { Card } from "@repo/ui/card";
import redis from "../lib/redis";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import search from "../lib/recentTrans";
import TransactionCard from "./TransactionCard";
import { Transaction } from "../lib/recentTrans";

export default async function AddMoneyTransactions({ n }: { n: number }) {
  const session = await getServerSession(authOptions);
  const CACHE_KEY = `${session?.user.id}addMoney`;
  let data: Transaction[] = [];
  let limit = 4;

  try {
    const cached = await redis.get(CACHE_KEY);
    data = cached ? JSON.parse(cached) : await search();
    limit = n === 0 ? 4 : data.length;
  } catch (e) {
    console.error("AddMoneyTransactions error:", e);
    data = [];
  }

  return (
    <div className="w-full flex justify-center items-center px-4">
      <Card
        title=" 💳 Add Money Transactions"
      >
        <p className="text-sm text-grey-300 mb-4 text-center">
          Track your recent Add Money activity.
        </p>

        {!session?.user ? (
          <p className="text-red-500 font-semibold text-center p-4">⚠️ Login First</p>
        ) : !data || data.length === 0 ? (
          <p className="text-red-500 text-center p-4">No transactions found.</p>
        ) : (
          <div className="space-y-4">
            {data.slice(0, limit).map((d: Transaction , i: number) => (
              <TransactionCard
                key={i}
                title={d.provider}
                amount={d.amount}
                date={d.startTime}
                status={d.status}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}