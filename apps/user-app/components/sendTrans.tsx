import { Card2 } from "@repo/ui/card";
import ts from "../lib/p2ptrans";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import redis from "../lib/redis";
import TransactionCard from "./TransactionCard";
import { Transaction } from "../lib/p2ptrans";

export default async function SendTransactions() {
  const session = await getServerSession(authOptions);
  const CACHE_KEY = `${session?.user.id}sendMoney`;
  let data: Transaction[] = [];

  try {
    const cached = await redis.get(CACHE_KEY);
    data = cached ? JSON.parse(cached) : await ts();
  } catch (e) {
    console.log(e)
    data = [];
  }


  return (
    <div className="w-full flex justify-center items-center px-4">
      <Card2
        title="📑 Send/Receive Transactions"
      >
        <p className="text-sm text-grey-300 mb-4 text-center">
          View your recent send & receive history.
        </p>

        {!session?.user ? (
          <p className="text-red-500 font-semibold text-center p-4">⚠️ Login First</p>
        ) : !data || data.length === 0 ? (
          <p className="text-red-500 text-center p-4">No transactions found.</p>
        ) : (
          <div className="space-y-4">
            {data.map((d: Transaction) => (
              <TransactionCard
                title=""
                key={d.id}
                amount={d.amount}
                date={d.tTime}
                isSent={d.senderId === session?.user?.id}
                receiverOrSender={
                  d.senderId === session?.user?.id ? d.recMobile : d.sendMobile
                }
              />
            ))}
          </div>
        )}
      </Card2>
    </div>
  );
}
