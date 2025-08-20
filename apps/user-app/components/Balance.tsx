import { Card } from "@repo/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { FaWallet, FaLock, FaCoins } from "react-icons/fa";
import getBal from "../lib/getBal";

export default async function Balance() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <h4 className="text-red-500 text-center text-lg font-semibold mt-4">
        Please login to view your balance.
      </h4>
    );
  }

  const data = await getBal();
  
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
      className="md:p-14 p-8 shadow-2xl rounded-3xl  text-white border-0"
    >
      <div className="space-y-4 p-4 rounded-xl bg-white/10 backdrop-blur-md">
        {/* Unlocked */}
        <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-green-300/20">
          <span className="flex items-center gap-4 text-green-900 font-semibold ">
            <FaWallet className="text-green-400" /> Unlocked Balance
          </span>
          <span className="text-black font-bold text-lg">
            ₹{unlocked.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Locked */}
        <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-orange-300/20">
          <span className="flex items-center gap-2 text-orange-900 font-semibold">
            <FaLock className="text-orange-400" /> Locked Balance
          </span>
          <span className="text-black font-bold text-lg">
            ₹{locked.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-blue-300/20">
          <span className="flex items-center gap-2 text-blue-800 font-semibold">
            <FaCoins className="text-blue-400" /> Total Balance
          </span>
          <span className="text-black font-bold text-xl">
            ₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </Card>
  );
}
