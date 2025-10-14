import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { signin } from "./auth/signin";
import { signup } from "./auth/signup";
import db from "@repo/db/client";

interface Credentials {
  phone: string;
  password: string;
  action?: "signin" | "signup";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text", placeholder: "9103597816" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text", placeholder: "signin or signup" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Missing credentials");

        const { phone, password, action } = credentials as Credentials;
        if (action === "signin") return await signin({ phone, password });
        if (action === "signup") return await signup({ phone, password });
        throw new Error("Invalid action");
      },
    }),

    GoogleProvider({
      clientId: process.env.clientId ?? "",
      clientSecret: process.env.clientSecret ?? "",
    }),

    GitHubProvider({
      clientId: process.env.githubId ?? "",
      clientSecret: process.env.githubSecret ?? "",
    }),
  ],

  secret: process.env.JWT_SECRET ?? "secret",

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        const existingUser = await db.user.findFirst({
        where: {
          OR: [
            {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
            {
              email: user.email,
            },
          ],
        },
        });

        if (existingUser) {
          user.id = existingUser.id;
        } else {
          const newUser = await db.user.create({
            data: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              name: user.name ?? "",
              email: user.email ?? "",
            },
          });

        await db.balance.create({
          data: { amount: 100, userId: newUser.id, locked: 0 },
        });
          user.id = newUser.id;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },

    async session({ session, token }) {
      if (token.sub) {
        const userInDb = await db.user.findUnique({
          where: { id: token.sub },
          select: { id: true, email: true, name: true, mobile: true },
        });

        session.user.id = token.sub;
        session.user.email = token.email ?? undefined;
        session.user.name = token.name ?? undefined;
        if(userInDb) session.user.mobile = userInDb.mobile || ""; 
      }

      return session;
    },
  },

  pages: {
    error: "/auth/error",
    signIn: "/auth/signup",
  },
};
