"use server";

import aksh from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { rateLimiter, redis } from "./upStashRateLimit";
import type { Prisma } from "@prisma/client";

export type OnRampResponse = { message?: string; token?: string ; error?: string };

export default async function onRampTrans(
  amount: number,
  provider: string
): Promise<OnRampResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Please login to initiate a transaction." };
  }

  const userId = session.user.id;

  // Rate limit
  const { success } = await rateLimiter.limit(`onRampTrans:${userId}`);
  if (!success)
    return {
      error: "Too many Add Money Requests. Please wait a minute.",
    };

  // Validations
  if (!amount || amount < 1)
    return {
      error: "Invalid amount. Please enter a value greater or equal to ₹1.",
    };

  if (!provider)
    return {
      error: "Invalid bank provider. Please select a valid provider.",
    };

  // Create token
  const token = Math.random().toString();

  try {
    // Prisma transaction creation
    await aksh.onRampTransaction.create({
      data: {
        status: "Processing",
        provider,
        amount: amount * 100,
        startTime: new Date(),
        userId,
        token,
      },
    });

    // Delete Redis cached balance
      await redis.del(`${userId}:addMoney`).catch((err) => {
        console.error("Redis deletion failed:", err);
      });

    return {
      message: "Transaction initiated successfully!",
      token,
    };
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;

    if (err.code === "P2002") {
      return { error: "Duplicate transaction. Please try again later." };
    }

    if (err.code === "P2025") {
      return { error: "User not found or invalid data." };
    }

    return {
      error: "Unexpected server error while initiating transaction.",
    };
  }
}
