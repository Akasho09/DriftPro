"use server";
import aksh from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import type { Session } from "next-auth";
import { redis } from "@repo/db/redis";

export interface Transaction {
  amount: number;
  id: number;
  senderId: string;
  receiverId: string;
  recMobile?: string | null ,
  sendMobile? : string | null ,
  tTime: Date | null;
}

export default async function ts(): Promise<Transaction[] | null> {

  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user) return null;

  const data = await aksh.p2ptransactions.findMany({
    orderBy: {
      tTime: "desc",
    },
    where: {
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id },
      ],
    },
  });

  const updatedData: Transaction[] = data.map((txn : Transaction) => ({
    ...txn,
    amount: txn.amount / 100, 
  }));

      
  try{
  await redis.set(`${session.user.id}:sendMoney` , JSON.stringify(updatedData) , {ex : 300})
  }catch(error){}

  return updatedData;
}
