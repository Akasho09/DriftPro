"use server";

import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { authOptions } from "./auth";

export async function SendMoney(to: string, amount: number) {
    try {
        // Fetch session details
        const session = await getServerSession(authOptions);
        console.log("Session:", session); // Debugging

        // Validate session
        if (!session || !session.user?.id) {
            return { message: "User not authenticated" };
        }

        const fromUserId = (session.user.id);
        if (!fromUserId) {
            return { message: "Invalid user ID" };
        }

        // Find recipient user
        const toUser = await prisma.user.findFirst({
            where: { mobile: to },
        });

        if (!toUser) {
            return { message: "Recipient not found" };
        }

        // Transaction to handle money transfer safely
        await prisma.$transaction(async (tx) => {
            // Lock sender's balance row
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${fromUserId} FOR UPDATE`;

            // Check sender's balance
            const fromBalance = await tx.balance.findUnique({
                where: { userId: fromUserId },
            });

            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error("Insufficient funds");
            }

            // Deduct money from sender
            await tx.balance.update({
                where: { userId: fromUserId },
                data: { amount: { decrement: amount } },
            });

            // Add money to recipient
            await tx.balance.update({
                where: { userId: toUser.id },
                data: { amount: { increment: amount } },
            });

            // Log the transaction
            await tx.p2ptransactions.create({
                data: {
                    fromNum: session.user.mobile,
                    toNum: toUser.mobile,
                    amount,
                    tTime: new Date(),
                },
            });
        });

        return { message: "Successfully transferred" };

    } catch (error) {
        console.error("SendMoney Error:", error);
        return { message: "Transaction failed", error: error };
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