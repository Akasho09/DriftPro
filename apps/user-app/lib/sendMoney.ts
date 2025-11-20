"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import aksh from "@repo/db/client";
import redis from "./redis";
import { rateLimiter } from "./upStashRateLimit";

interface SendMoneyResult {
  success: boolean;
  message: string;
}

export default async function SendMoney(
  toNum: string,
  amountt: number
): Promise<SendMoneyResult>{
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, message: "Invalid User."};
  }

  const userId = session.user.id;
  const { success } = await rateLimiter.limit(`sendmoney_${userId}`);
  if (!success) {
    return {
      success: false,
      message: "Too many transfers. Please wait a minute."
    };
  }
  const receiver = await aksh.user.findFirst({
    where:  { mobile: toNum },
    select: { id: true },
  });

  const sender = await aksh.user.findFirst({
    where:  { id: session.user.id },
    select: { id: true, mobile: true },
  });

  if (!sender) return { success: false, message: "Login First" };
  if (!receiver) return { success: false, message: "Invalid Mobile Number" };
  if (session.user.id === receiver.id)
    return { success: false, message: "Cannot send money to yourself" };

  try {
    const result = await aksh.$transaction(async (tx: any): Promise<SendMoneyResult> => {
      // Lock sender row
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${session.user.id} FOR UPDATE`;

      const senderBalance = await tx.balance.findFirst({
        where: { userId: session.user.id },
        select: { amount: true },
      });

      if (!senderBalance || senderBalance.amount < amountt) {
        return { success: false, message: "Transaction failed: Insufficient balance." };
      }

      // Deduct from sender
      await tx.balance.updateMany({
        where: { userId: session.user.id },
        data: { amount: { decrement: amountt } },
      });

      // Add to receiver
      await tx.balance.updateMany({
        where: { userId: receiver.id },
        data: { amount: { increment: amountt } },
      });

      // Log transaction
      await tx.p2ptransactions.create({
        data: {
          senderId: sender.id,
          receiverId: receiver.id,
          recMobile: toNum,
          sendMobile: sender?.mobile || "MOBILE_UNKNOWN",
          amount: amountt,
          tTime: new Date(),
        },
      });

      // Clear cache
      await redis.del(`${receiver.id}sendMoney`);
      await redis.del(`${sender.id}sendMoney`);

      return { success: true, message: "Successfully transferred" };
    });

    return result;
  } catch (err) {
    console.error("SendMoney error:", err);
    return { success: false, message: "Transaction failed due to server error" };
  }
}


// "use server"
// import { getServerSession } from "next-auth";
// import { authOptions } from "./auth";
// import aksh from "@repo/db/client";

// export default async function SendMoney(to:string , amountt : number){
//     const session = await getServerSession(authOptions)
//     if (!session || !session.user) {
//         return "Invalid user";
//     }
    
//     const receiver = await aksh.user.findFirst({
//         where: {
//             mobile: to
//         },
//         select: {
//             id: true
//         }
//     });

//     if (!receiver) {
//         return "Invalid Mobile Number";
//     }
//     // Prevent sending money to yourself
//     if (session.user.id === receiver.id) {
//     return "Cannot send money to yourself";
//     }

//     try {
//       await aksh.$transaction(
//         async (tx) => {
//           // await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${session?.user?.id} FOR UPDATE`;
//         const senderbal = await tx.balance.findUnique({
//             where: { userId : session.user.id }
//         })
//         if(!senderbal || senderbal?.amount<amountt) {
//           return ("Insufficient Balance");
//       }
//           await tx.balance.update({
//             where: { userId: session.user.id },
//             data: { amount: { decrement: Number(amountt) } },
//           });
    
//           await tx.balance.update({
//             where: { userId: receiver.id },
//             data: { amount: { increment: Number(amountt) } },
//           });

//           await tx.p2ptransactions.create({
//             data: {
//               fromNum : session.user.id,
//               toNum : receiver.id ,
//               amount : amountt ,
//               tTime : new Date()
//             }
//           })
//         }
//       );
//       return "Successfully transferred";
//     } catch (e) {
//       console.error("Transaction failed:", e);
//       return "Transaction failed: " + e;
//     }
//     }    
/*

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { aksh } from "@repo/db/client"; // Fixed typo in import
import { z } from "zod"; // Assuming you're using zod for validation

// Define input schema for better type safety
const SendMoneySchema = z.object({
  to: z.string().min(1, "Recipient mobile number is required"),
  amount: z.number().positive("Amount must be positive").finite(),
});

// Define response type
type SendMoneyResponse = {
  success: boolean;
  message: string;
  transactionId?: string;
};

export async function SendMoney(
  to: string,
  amount: number
): Promise<SendMoneyResponse> {
  try {
    // Validate input
    const validatedInput = SendMoneySchema.parse({ to, amount });

    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized: Please log in",
      };
    }

    // Start transaction with isolation level
    return await aksh.$transaction(async (tx) => {
      // Get receiver
      const receiver = await tx.user.findFirst({
        where: { mobile: validatedInput.to },
        select: { id: true },
      });

      if (!receiver) {
        throw new Error("Invalid Mobile Number");
      }

      // Prevent self-transfer
      if (session.user.id === receiver.id) {
        throw new Error("Cannot send money to yourself");
      }

      // Get sender balance with lock for update
      const senderBalance = await tx.balance.findFirst({
        where: { userId: session.user.id },
        select: { amount: true },
        lock: "UPDATE", // Prevent concurrent modifications
      });

      if (!senderBalance || senderBalance.amount < validatedInput.amount) {
        throw new Error("Insufficient Balance");
      }

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          senderId: session.user.id,
          receiverId: receiver.id,
          amount: validatedInput.amount,
          status: "PENDING",
          type: "TRANSFER",
        },
      });

      // Update balances
      const [senderUpdate, receiverUpdate] = await Promise.all([
        tx.balance.update({
          where: { userId: session.user.id },
          data: { amount: { decrement: validatedInput.amount } },
        }),
        tx.balance.update({
          where: { userId: receiver.id },
          data: { amount: { increment: validatedInput.amount } },
        }),
      ]);

      // Verify updates
      if (!senderUpdate || !receiverUpdate) {
        throw new Error("Failed to update balances");
      }

      // Update transaction status
      await tx.transaction.update({
        where: { id: transaction.id },
        data: { status: "COMPLETED" },
      });

      return {
        success: true,
        message: "Successfully transferred",
        transactionId: transaction.id,
      };
    }, {
      isolationLevel: "Serializable", // Ensure data consistency
      maxWait: 5000, // Timeout after 5 seconds
      timeout: 10000,
    });
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.errors[0].message
        : error instanceof Error
        ? error.message
        : "Transaction failed";

    return {
      success: false,
      message,
    };
  }
}

*/