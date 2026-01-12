"use server";
import aksh from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import type { Session } from "next-auth";
import { rateLimiter ,redis } from "@repo/db/redis";

export type Transaction = {
  amount: number;
  provider: string;
  startTime: null | Date;
  status: "Success" | "Failure" | "Processing";
};

export default async function search(): Promise<Transaction[] | null>{
  const session: Session | null = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  
  const { success } = await rateLimiter.limit(`recentTrans${session.user.id}`);
  if (!success) return null ; 

  const data = await aksh.onRampTransaction.findMany({
    orderBy:{
      startTime: "desc",
    },
    where:{
      userId: session.user.id,
    },
    select:{
      provider: true,
      amount: true,
      startTime: true,
      status: true,
    },
  });

  const upData: Transaction[] = data.map((d : Transaction) => ({
    ...d,
    amount: d.amount / 100, 
  }));
    
  try{
  await redis.set(`${session.user.id}:addMoney` , JSON.stringify(upData) , {ex : 300 })
  }catch(error){
      console.error("Failed to cache addMoney:", error);
  }
  // await redis.set(`${session.user.id}addMoney` , JSON.stringify(upData) , "EX" , 300)
  
  return upData;
}
