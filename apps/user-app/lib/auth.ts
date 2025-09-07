import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import {signin} from "./auth/signin"
import {signup} from "./auth/signup"
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
        try {
          if (!credentials) throw new Error("Missing credentials");
          const { phone, password, action } = credentials as Credentials;
          if (action === "signin") {
            return await signin({ phone, password });
          } else if (action === "signup") {
            return await signup({ phone, password });
          } else {
            throw new Error("Invalid action");
          }
        } catch (e) {
         throw new Error("Error: " + (e instanceof Error ? e.message : String(e)));
        }
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
    async signIn ({ user, account}) {
    if (account?.provider === "google" || account?.provider === "github") {
      const existingUser = await db.user.findFirst({ where: { mobile: String(user.email) } });
      if(existingUser) user.id = existingUser?.id
      else {
        const newUser = await db.user.create({
          data:{
            mobile : String(user.email) , 
            hashedPassword : String(user.email)
          }
        })
        user.id = newUser?.id
      }
    }
      return true ;
    }, 

    async session({ session, token }) {
      if (token.sub){
        session.user.id  = token.sub ;
        session.user.email = token.email ?? undefined;
      }
      return session;
    },
  },

  pages: {
    error: "/auth/error",
    signIn: "/auth/signup",
  },
};
