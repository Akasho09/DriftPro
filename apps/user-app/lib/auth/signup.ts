import db from "@repo/db/client";
import bcrypt from "bcrypt";

interface SignupParams {
  phone: string;
  password: string;
}

export async function signup({ phone, password }: SignupParams) {

  const existingUser = await db.user.findFirst({ where: { mobile: phone } });

  if(existingUser) {
    throw new Error("User already exists. Please sign in if you already have an account.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.user.create({
    data: {
      mobile: phone,
      hashedPassword,
    },
  });


  await db.balance.create({
    data: { amount: 100, userId: newUser.id, locked: 0 },
  });

  return {
    id: newUser.id.toString(),
    email: newUser.email,
  };
}
