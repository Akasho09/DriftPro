import { Card } from "@repo/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import search from "../lib/recentTrans";
import {AddCard} from "./TransactionCard";
import { Transaction } from "../lib/recentTrans";
import {redis} from "@repo/db/redis";

export default async function AddMoneyTransactions() {
  const session = await getServerSession(authOptions);
  const CACHE_KEY = `${session?.user.id}:addMoney`;
  let data: Transaction[] | null = [];

  try {
    const cached = await redis.get(CACHE_KEY);
    data = cached ? (cached as Transaction[]) : await search();
  } catch (e) {
    data = [];
  }

  return (
    <div className="flex justify-center items-center">
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
            {data.map((d: Transaction , i: number) => (
              <AddCard
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