import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import db from "@repo/db/client";
import { authOptions } from "../../../lib/auth";

const updateSchema = z.object({
  name: z.string().trim().min(1, "Name cannot be empty").optional(),
  mobile: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Mobile number must be 10 digits")
    .optional(),
});

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, mobile } = parsed.data;
    const updateData: Record<string, any> = {};

    if (name) updateData.name = name;

    if (mobile) {
      const existingUser = await db.user.findFirst({
        where: {
          mobile,
          NOT: { id: session.user.id },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Mobile number already registered" },
          { status: 400 }
        );
      }

      updateData.mobile = mobile;
      updateData.isMobileVerified = true;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, updatedFields: updateData });
  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
