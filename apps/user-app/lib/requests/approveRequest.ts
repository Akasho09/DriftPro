"use server";

import { getServerSession } from "next-auth";
import aksh from "@repo/db/client";
import { authOptions } from "../auth";
import SendMoney from "../sendMoney";

export default async function approveRequest(requestId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: "Not logged in." };

  const userId = session.user.id;

  // Fetch request details
  const req = await aksh.requests.findUnique({
    where: { id: requestId },
    select:{
        toId : true ,
        fromNum : true,
        amount : true
    }
  });

  if (!req) return { success: false, message: "Request not found." };

  // Only receiver can approve
  if (req.toId !== userId) {
    return { success: false, message: "Not authorized to approve." };
  }

  // Ensure the request has a valid fromNum
  if (!req.fromNum) {
    return { success: false, message: "Invalid sender mobile number." };
  }

  // Send money automatically
  const sendRes = await SendMoney(req.fromNum, req.amount);

  if (!sendRes.success) {
    return { success: false, message: "Payment failed: " + sendRes.message };
  }

  // Mark request as Success
  await aksh.requests.update({
    where: { id: requestId },
    data: { status: "Success" },
  });

  return { success: true, message: "Request approved & money sent." };
}
