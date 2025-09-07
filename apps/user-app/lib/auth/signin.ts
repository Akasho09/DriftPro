import db from "@repo/db/client";
import bcrypt from "bcrypt";

interface SigninParams {
  phone: string;
  password: string;
}

export async function signin({ phone, password }: SigninParams) {
  const user = await db.user.findFirst({ where: { mobile: phone } });
  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isValid) {
    throw new Error("Invalid Password");
  }

  return {
    id: user.id.toString(),
    email: user.email,
  };
}
