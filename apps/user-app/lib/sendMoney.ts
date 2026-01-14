"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import aksh from "@repo/db/client";
import { rateLimiter ,redis } from "@repo/db/redis";
import type { Prisma } from "@prisma/client";

interface SendMoneyResult {
  success: boolean;
  message: string;
}

export default async function SendMoney(
  toNum: string,
  amount: number
): Promise<SendMoneyResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, message: "Invalid User." };
  }

  const userId = session.user.id;

  // Rate limit by user
  const { success } = await rateLimiter.limit(`sendmoney_${userId}`);
  if (!success) {
    return {
      success: false,
      message: "Too many transfers. Please wait a minute.",
    };
  }

  // Fetch receiver
  const receiver = await aksh.user.findFirst({
    where: { mobile: toNum },
    select: { id: true },
  });

  // Sender
  const sender = await aksh.user.findFirst({
    where: { id: userId },
    select: { id: true, mobile: true },
  });

  if (!sender) return { success: false, message: "Login First" };
  if (!receiver) return { success: false, message: "Invalid Mobile Number" };
  if (sender.id === receiver.id)
    return { success: false, message: "Cannot send money to yourself" };

  try {
    const result = await aksh.$transaction(
      async (tx): Promise<SendMoneyResult> => {
        // Lock sender balance row for concurrency safety
        await tx.$queryRaw<
          unknown[]
        >`SELECT * FROM "Balance" WHERE "userId" = ${sender.id} FOR UPDATE`;

        const senderBalance = await tx.balance.findFirst({
          where: { userId: sender.id },
          select: { amount: true },
        });

        if (!senderBalance || senderBalance.amount < amount) {
          return {
            success: false,
            message: "Transaction failed: Insufficient balance.",
          };
        }

        // Deduct sender balance
        await tx.balance.updateMany({
          where: { userId: sender.id },
          data: { amount: { decrement: amount } },
        });

        // Add to receiver balance
        await tx.balance.updateMany({
          where: { userId: receiver.id },
          data: { amount: { increment: amount } },
        });

        // Log P2P transaction
        await tx.p2ptransactions.create({
          data: {
            senderId: sender.id,
            receiverId: receiver.id,
            recMobile: toNum,
            sendMobile: sender.mobile ?? "UNKNOWN",
            amount,
            tTime: new Date(),
          },
        });

        // Clear cached balances
    await redis.del(`${receiver.id}:sendMoney`).catch((err) => {
      console.error("Redis deletion failed:", err);
    });
    await redis.del(`${sender.id}:sendMoney`).catch((err) => {
      console.error("Redis deletion failed:", err);
    });

        return { success: true, message: "Successfully transferred" };
      }
    );

    return result;
  } catch (error) {
    const err = error as Prisma.PrismaClientKnownRequestError;

    if (err.code === "P2002") {
      return {
        success: false,
        message: "Duplicate transaction or constraint error.",
      };
    }

    if (err.code === "P2025") {
      return {
        success: false,
        message: "One of the users involved no longer exists.",
      };
    }

    return {
      success: false,
      message: "Transaction failed due to server error.",
    };
  }
}
