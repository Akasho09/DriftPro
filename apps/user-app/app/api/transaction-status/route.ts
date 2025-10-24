import prisma from "@repo/db/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const transaction = await prisma.onRampTransaction.findUnique({
      where: { token },
    });

    if (!transaction) {
      return NextResponse.json({ status: "NOT_FOUND" }, { status: 404 });
    }

    // ⏳ Timeout logic using startTime instead of createdAt
    const TIMEOUT_MINUTES = 1;
    const ageMs = Date.now() - new Date(transaction.startTime).getTime();

    if (transaction.status === "Processing" && ageMs > TIMEOUT_MINUTES * 30 * 1000) {
      const updated = await prisma.onRampTransaction.update({
        where: { token },
        data: {
          status: "Failure",
        },
      });
      return NextResponse.json({ status: updated.status, autoFailed: true });
    }

    return NextResponse.json({ status: transaction.status });
  } catch (err) {
    console.error("Transaction-status error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
