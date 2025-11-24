"use server";

import { getServerSession } from "next-auth";
import aksh from "@repo/db/client";
import { authOptions } from "../auth";

export default async function rejectRequest(requestId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, message: "Not logged in." };

  const userId = session.user.id;

  const req = await aksh.requests.findUnique({
    where: { id: requestId },
  });

  if (!req || req.status!=="Processing") return { success: false, message: "Request not found." };

  // Only receiver can reject
  if (req.toId !== userId) {
    return { success: false, message: "Not authorized." };
  }

  await aksh.requests.update({
    where: { id: requestId },
    data: { status: "Failure" },
  });

  return { success: true, message: "Request rejected." };
}
