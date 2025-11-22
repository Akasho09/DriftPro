"use server";

import aksh from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import redis from "./redis";
import { rateLimiter } from "./upStashRateLimit";

export default async function onRampTrans(amount: number, provider: string) {
  const s = await getServerSession(authOptions);

  if (!s?.user?.id) {
    return { error: "Please login to initiate a transaction." };
  }
  
  const { success } = await rateLimiter.limit(`onRampTrans${s.user.id}`);

  if (!success) return { error: "Too many Add Money Requests. Please wait a minute."};
  if (!amount || amount < 1) return { error: "Invalid amount. Please enter a value greater or equal to ₹1." };
  if (!provider) return { error: "Invalid bank provider. Please select a valid provider." };

  const userId = s.user.id;
  const token = Math.random().toString();

  try {
    await aksh.onRampTransaction.create({
      data: {
        status: "Processing",
        provider,
        amount: Number(amount) * 100,
        startTime: new Date(),
        userId,
        token,
      },
    });

    await redis.del(`${userId}addMoney`);
    return { message: "Transaction initiated successfully!", token };
  } catch (e: any) {
    console.error("Server error in onRampTrans:", e);

    if (e.code === "P2002") {
      return { error: "Duplicate transaction. Please try again later." };
    }

    if (e.code === "P2025") {
      return { error: "User not found or invalid data." };
    }

    return { error: "Unexpected server error while initiating transaction." };
  }
}
