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


export async function getContacts () {
  const session: Session | null = await getServerSession(authOptions);

  try {
    const users = await aksh.user.findMany({
      select: {
        id: true,
        name: true,
        mobile: true,
        email : true,
        Image : true
      },
      where: {
        NOT: {
          mobile: session?.user.mobile,
        },
      },
      orderBy: {
        name: "asc", 
      },
    });

    return users;
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    return [];
  }
}