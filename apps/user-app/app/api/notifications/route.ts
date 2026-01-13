import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { authOptions } from "../../../lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ count: 0, notifications: [] });
  }

  const requests = await prisma.requests.findMany({
    where: {
      toId: session.user.id,
      status: "Processing",
    },
    select: {
      id: true,
      amount: true,
      fromMsg: true,
    }
  });
  
  console.log("akash")
  return NextResponse.json({
    count: requests.length,
    notifications: requests,
  });
}
