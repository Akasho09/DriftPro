import React from "react";
import { Card } from "@repo/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { FaWallet, FaLock, FaCoins } from "react-icons/fa";
import getBal from "../lib/getBal";
import clsx from "clsx";

interface BalanceData {
  amount: number;
  locked: number;
}


export default async function Balance(): Promise<React.ReactElement> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <p className="text-red-500 text-center font-medium">
        Login to view balance
      </p>
    );
  }

  const data: BalanceData | null = await getBal();
  if (!data) {
    return (
      <p className="text-red-500 text-center font-medium">
        Balance not found
      </p>
    );
  }

  const unlocked = data.amount / 100 || 0;
  const locked = data.locked || 0;
  const total = unlocked + locked;

  const items = [
    {
      label: "Unlocked",
      value: unlocked,
      icon: <FaWallet />,
      variant : "default",
      iconColor: "text-green-500",
      description: "This is your unlocked balance, ready to use",
    },
    {
      label: "Locked",
      value: locked,
      icon: <FaLock />,
      variant: "outlined",
      iconColor: "text-pink-500",
      description: "Locked funds are not currently accessible",
    },
    {
      label: "Total",
      value: total,
      icon: <FaCoins />,
      variant: "default",
      iconColor: "text-white",
      description: "Your total balance including unlocked and locked funds",
    },
  ];

  return (
    <div className="flex justify-center w-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {items.map((item) => (
          <Card
            key={item.label}
            title={item.label}
            icon={<span className={clsx("text-xl", item.iconColor)}>{item.icon}</span>}
            subtitle={`₹${item.value.toFixed(2)}`}
          >
            <p className="mt-2 text-xs text-grey-300">{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
