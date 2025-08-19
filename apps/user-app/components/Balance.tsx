import { Card } from "@repo/ui/card";
import aksh from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { FaWallet, FaLock, FaCoins } from "react-icons/fa";

export default async function Balance() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <h4 className="text-red-500 text-center text-lg font-semibold mt-4">
        Please login to view your balance.
      </h4>
    );
  }

  const data = await aksh.balance.findFirst({
    where: {
      userId: session.user.id,
    },
    select: {
      amount: true,
      locked: true,
    },
  });

  if (!data) {
    return (
      <h4 className="text-red-500 text-center text-lg font-semibold mt-4">
        Balance Not Found
      </h4>
    );
  }

  const unlocked = (data.amount / 100) || 0;
  const locked = data.locked || 0;
  const total = unlocked + locked;

  return (
    <Card
      title="💳 Wallet Balance"
      className="p-6 shadow-lg rounded-2xl bg-white border border-gray-200"
    >
      <div className="divide-y divide-gray-200 space-y-4 bg-gray-50 p-4 rounded-lg">
        {/* Unlocked */}
        <div className="flex justify-between items-center py-2">
          <span className="flex items-center gap-2 text-gray-600 font-medium">
            <FaWallet className="text-green-500" /> Unlocked Balance
          </span>
          <span className="text-green-600 font-semibold text-lg">
            ₹{unlocked.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Locked */}
        <div className="flex justify-between items-center py-2">
          <span className="flex items-center gap-2 text-gray-600 font-medium">
            <FaLock className="text-orange-500" /> Locked Balance
          </span>
          <span className="text-orange-500 font-semibold text-lg">
            ₹{locked.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center py-2 font-semibold">
          <span className="flex items-center gap-2 text-gray-800 text-lg">
            <FaCoins className="text-blue-500" /> Total Balance
          </span>
          <span className="text-blue-600 text-xl">
            ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </Card>
  );
}
