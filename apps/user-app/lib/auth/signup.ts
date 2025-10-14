import db from "@repo/db/client";
import bcrypt from "bcrypt";
import { signupSchema } from "../zod";

interface SignupParams {
  phone: string;
  password: string;
}

export async function signup({ phone, password }: SignupParams) {
  const parsed = signupSchema.safeParse({ phone, password });
  if (!parsed.success) {
    const errorMessage =
      parsed.error && parsed.error.errors && parsed.error.errors[0]
        ? parsed.error.errors[0].message
        : "Invalid input";
    throw new Error(errorMessage); 
  }

  const existingUser = await db.user.findFirst({
    where: { mobile: parsed.data.phone },
  });

  if (existingUser) {
    throw new Error("User already exists. Please sign in if you already have an account.");
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  const newUser = await db.user.create({
    data: {
      mobile: parsed.data.phone,
      hashedPassword,
    },
  });

  await db.balance.create({
    data: {
      amount: 100, 
      userId: newUser.id,
      locked: 0,
    },
  });

  return {
    id: newUser.id.toString(),
    email: newUser.email,
    mobile: newUser.mobile,
  };
}
