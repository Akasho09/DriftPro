import { Card } from "@repo/ui/card";
import aksh from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export default async function Balance() {
  const session = await getServerSession(authOptions);
  const data = await aksh.balance.findFirst({
    where: {
      userId: session?.user?.id,
    },
    select: {
      amount: true,
      locked: true,
    },
  });

  const P = !data ? (
    <h4 className="text-red-500 text-center text-lg font-semibold mt-4">
      Balance Not Found
    </h4>
  ) : (
    <Card title="Balance" className="p-6 shadow-md rounded-xl">
      <div className="divide-y divide-gray-300 space-y-4 bg-white p-4 border rounded-lg shadow-lg">
        <div className="flex justify-between items-center py-2">
          <h3 className="text-gray-600 font-medium">Unlocked Balance</h3>
          <h3 className="text-green-600 font-semibold text-lg">
            ₹{data?.amount?.toFixed(2)}
          </h3>
        </div>
        <div className="flex justify-between items-center py-2">
          <h3 className="text-gray-600 font-medium">Total Locked Balance</h3>
          <h3 className="text-orange-500 font-semibold text-lg">
            ₹{data?.locked?.toFixed(2)}
          </h3>
        </div>
        <div className="flex justify-between items-center py-2 font-semibold">
          <h3 className="text-gray-800 text-lg">Total Balance</h3>
          <h3 className="text-blue-600 text-xl">
            ₹{((data?.amount || 0) + (data?.locked || 0)).toFixed(2)}
          </h3>
        </div>
      </div>
    </Card>
  );

  return P;
}
