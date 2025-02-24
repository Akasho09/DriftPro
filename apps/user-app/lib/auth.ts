import {PrismaClient} from "@repo/db/client";
const db = new PrismaClient()
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone mobile", type: "text", placeholder: "1231231231", required: true },
            hashedPassword: { label: "hashedPassword", type: "hashedPassword", required: true }
          },
          // TODO: User credentials type from next-aut
          async authorize(credentials: any) {
            // Do zod validation, OTP validation here
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
                        email: existingUser.mobile
                    }
                }
                return null;
            }

            try {
                const user = await db.user.create({
                    data: {
                        mobile: credentials.phone,
                        hashedPassword: hashedhashedPassword
                    }
                });
            
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
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        // TODO: can u fix the type here? Using any is bad
        async session({ token, session }: any) {
            session.user.id = token.sub

            return session
        }
    }
}
  