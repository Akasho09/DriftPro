"use server";

import aksh from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import type { Session } from "next-auth";

/* -------------------- Types -------------------- */
type Transaction = {
  amount: number;
  provider: string;
  startTime: string | Date;
  status: "Success" | "Failure" | "Processing";
};

/* -------------------- Function -------------------- */
export default async function search(): Promise<Transaction[] | null> {
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const data = await aksh.onRampTransaction.findMany({
    orderBy: {
      startTime: "desc",
    },
    where: {
      userId: session.user.id,
    },
    select: {
      provider: true,
      amount: true,
      startTime: true,
      status: true,
    },
  });

  const upData: Transaction[] = data.map((d : Transaction) => ({
    ...d,
    amount: d.amount / 100, // normalize
  }));

  return upData;
}
