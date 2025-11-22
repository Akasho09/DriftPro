import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { signin } from "./auth/signin";
import { signup } from "./auth/signup";
import db from "@repo/db/client";
import { authLimiter } from "./upStashRateLimit";

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
      async authorize(credentials , req) {
        if (!credentials) throw new Error("Missing credentials");

        const ip = req?.headers?.["x-forwarded-for"] || req?.headers?.["x-real-ip"] || "unknown";
        const { success } = await authLimiter.limit(ip.toString());
        if (!success) {
          throw new Error("Too many attempts. Try again in a minute.");
        }
        const { phone, password, action } = credentials as Credentials;
        if (action === "signin") return await signin({ phone, password });
        if (action === "signup") return await signup({ phone, password });
        throw new Error("Invalid action");
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
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
        session.user.picture = token.picture ?? undefined;
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
