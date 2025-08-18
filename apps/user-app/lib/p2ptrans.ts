"use server";

import aksh from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import type { Session } from "next-auth";

/* -------------------- Types -------------------- */
type Transaction = {
  id: number;
  fromNum: string;
  toNum: string;
  amount: number;
  tTime: Date | null;
};

/* -------------------- Function -------------------- */
export default async function ts(): Promise<Transaction[] | null> {
  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user?.email) return null;

  const data = await aksh.p2ptransactions.findMany({
    orderBy: {
      tTime: "desc",
    },
    where: {
      OR: [
        { fromNum: session.user.email },
        { toNum: session.user.email },
      ],
    },
  });

  const updatedData: Transaction[] = data.map((txn : Transaction) => ({
    ...txn,
    amount: txn.amount / 100, // ✅ Normalize amount
  }));

  return updatedData;
}
