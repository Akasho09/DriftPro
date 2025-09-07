"use server";

import aksh from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import type { Session } from "next-auth";


export default async function getBal() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session?.user.id) return null;

  const data = await aksh.balance.findFirst({
    where: {
      userId: session.user.id,
    },
    select: {
      amount: true,
      locked: true,
    },
  });


  return data;
}
