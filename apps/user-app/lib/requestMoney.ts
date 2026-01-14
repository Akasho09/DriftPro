"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import aksh from "@repo/db/client";

export default async function RequestMoney(toMobile: string, amount: number) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, message: "Invalid user." };
  }

  const requesterId = session.user.id;

  const receiver = await aksh.user.findFirst({
    where: { mobile: toMobile },
    select: { id: true, name: true },
  });

  if (!receiver) {
    return { success: false, message: "Mobile number not registered." };
  }

  if (receiver.id === requesterId) {
    return { success: false, message: "Cannot request money from yourself." };
  }

  await aksh.requests.create({
   data: {
      fromId: requesterId,
      toId: receiver.id,
      amount,
      fromNum : session.user.mobile,
      toNum : toMobile,
      status : "Processing"
    },
  });

  return {
    success: true,
    message: `Request sent to ${receiver.name || "user"}`,
  };
}
