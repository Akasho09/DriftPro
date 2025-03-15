import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import db from "@repo/db/client";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone Number",
          type: "text",
          placeholder: "+91 9103######",
          required: true,
        },
        hashedPassword: {
          label: "Password",
          type: "password",
          required: true,
        },
      },
      async authorize(
        credentials: Record<"phone" | "hashedPassword", string> | undefined
      ): Promise<User | null> {
        if (!credentials || !credentials.phone || !credentials.hashedPassword) {
          return null;
        }

        // Find user in DB
        const existingUser = await db.user.findFirst({
          where: { mobile: credentials.phone },
        });

        if (existingUser) {
          const isPasswordValid = await bcrypt.compare(
            credentials.hashedPassword,
            existingUser.hashedPassword
          );

          if (isPasswordValid) {
            return { id: existingUser.id.toString(), email: existingUser.mobile };
          }
          return null;
        }

        try {
          // Hash password before storing
          const hashedPassword = await bcrypt.hash(credentials.hashedPassword, 10);

          // Create new user
          const newUser = await db.user.create({
            data: {
              mobile: credentials.phone,
              hashedPassword: hashedPassword,
            },
          });

          // Initialize balance
          await db.balance.create({
            data: {
              amount: 100,
              userId: newUser.id,
              locked: 0,
            },
          });

          return { id: newUser.id.toString(), email: newUser.mobile };
        } catch (error) {
          console.error("Error creating user:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id; // what was sub
      }
      return session;
    },
  },
};
