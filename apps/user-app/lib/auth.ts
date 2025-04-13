import db from "@repo/db/client"
import { z  } from "zod";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import GoogleProvider from 'next-auth/providers/google';

const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, {
    message: "Invalid Indian phone number",
});

const strongPasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[a-z]/, { message: "Must include a lowercase letter" })
  .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
  .regex(/\d/, { message: "Must include a number" })
  .regex(/[^A-Za-z0-9]/, { message: "Must include a special character" });

const cType = z.object({
        phone : phoneSchema ,
        hashedPassword : strongPasswordSchema
})

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone mobile", type: "text", placeholder: "1231231231", required: true },
            hashedPassword: { label: "hashedPassword", type: "password", required: true }
          },
          // TODO: User credentials type from next-aut
        async authorize( credentials) {
        if (!credentials) return null;

        const parsed = cType.safeParse(credentials);
        if (!parsed.success) {
          console.error("Validation failed", parsed.error.flatten().fieldErrors);
          return null
        }
           const hashedhashedPassword = await bcrypt.hash(credentials.hashedPassword, 10);
            const existingUser = await db.user.findFirst({
                where: {
                    mobile: credentials.phone
                }
        });

            if (existingUser) {
                const hashedPasswordValidation = await bcrypt.compare(credentials.hashedPassword, existingUser.hashedPassword);
                if (hashedPasswordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        email : existingUser.mobile
                    }
                }
                return null;
            }

            try {
                const user = await db.user.create({
                    data: {
                        mobile: credentials.phone,
                        hashedPassword: hashedhashedPassword,
                    }
                });
                await db.balance.create({
                    data: {
                        amount: 100 ,
                        userId: user.id,
                        locked : 0
                    }
                })
                return {
                    id: user.id.toString(),
                    email: user.mobile
                }
            } catch(e) {
                console.error("ERRORR R  : " , e);
            }

            return null
          },
        }),
        GoogleProvider({        
            clientId: process.env.clientId || "",
            clientSecret: process.env.clientSecret || ""
        }
    )
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub
            return session
        }
    }
}