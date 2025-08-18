import db from "@repo/db/client";
import { z } from "zod";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, DefaultSession } from "next-auth";

/* ------------------------- Extend NextAuth Types ------------------------- */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone?: string;
    } & DefaultSession["user"];
  }
}

/* ------------------------- Zod Schemas ------------------------- */
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

const credentialsSchema = z.object({
  phone: phoneSchema,
  password: strongPasswordSchema, // ✅ renamed (plain password from UI)
});

/* ------------------------- Helper Function ------------------------- */
async function handleCredentialsAuth(credentials: any) {
  try {
    if (!credentials) return null;

    // ✅ Validate input
    const parsed = credentialsSchema.safeParse(credentials);
    if (!parsed.success) {
      const errorMessages = Object.values(
        parsed.error.flatten().fieldErrors
      ).flat();
      throw new Error(errorMessages.join(", "));
    }

    const { phone, password } = parsed.data;

    // ✅ Check if user exists
    const existingUser = await db.user.findFirst({ where: { mobile: phone } });

    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.hashedPassword
      );
      if (!isPasswordValid) throw new Error("Invalid phone or password.");

      return {
        id: existingUser.id.toString(),
        phone: existingUser.mobile,
      };
    }

    // ✅ Create new user if not found
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
      phone: newUser.mobile,
    };
  } catch (error) {
    console.error("Auth Error:", error);
    return Promise.reject(new Error("Authentication failed. Please try again."));
  }
}

/* ------------------------- NextAuth Options ------------------------- */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone",
          type: "text",
          placeholder: "1231231231",
        },
        password: { label: "Password", type: "password" }, // ✅ fixed
      },
      async authorize(credentials) {
        try {
          return await handleCredentialsAuth(credentials);
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.clientId ?? "",
      clientSecret: process.env.clientSecret ?? "",
    }),
  ],

  secret: process.env.JWT_SECRET ?? "secret",

  callbacks: {
    async session({ token, session }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

    async signIn({ user }) {
      try {
        console.log("Google/Other User:", user);

        // Hash a safe password (fallback if using Google login)
        const fallbackPassword = await bcrypt.hash(
          user.name || "Default@123",
          10
        );

        await db.user.upsert({
          where: { mobile: user.email ?? "unknown" },
          update: {},
          create: {
            mobile: user.email ?? "unknown",
            hashedPassword: fallbackPassword,
          },
        });

        return true;
      } catch (error) {
        console.error("SignIn Error:", error);
        return false;
      }
    },
  },

  pages: {
    error: "/auth/error",
  },
};
