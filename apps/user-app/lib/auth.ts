import db from "@repo/db/client";
import { z } from "zod";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

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
  hashedPassword: strongPasswordSchema,
});

type CredentialsType = z.infer<typeof credentialsSchema>;

/* ------------------------- Helper Function ------------------------- */
async function handleCredentialsAuth(credentials: any) {
  try {
    if (!credentials) {
      return null; // fail silently, NextAuth handles error
    }

    // ✅ Validate input
    const parsed = credentialsSchema.safeParse(credentials);
    if (!parsed.success) {
      const errorMessages = Object.values(
        parsed.error.flatten().fieldErrors
      ).flat();
      return Promise.reject(new Error(errorMessages.join(", ")));
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(credentials.hashedPassword, 10);

    // ✅ Check if user exists
    const existingUser = await db.user.findFirst({
      where: { mobile: credentials.phone },
    });

    if (existingUser) {
      const isPasswordValid = await bcrypt.compare(
        credentials.hashedPassword,
        existingUser.hashedPassword
      );
      if (!isPasswordValid) {
        return Promise.reject(new Error("Invalid phone or password."));
      }

      return {
        id: existingUser.id.toString(),
        email: existingUser.mobile,
      };
    }

    // ✅ Create new user if not found
    const newUser = await db.user.create({
      data: {
        mobile: credentials.phone,
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
      email: newUser.mobile,
    };
  } catch (error: any) {
    console.error("Auth Error:", error);
    return Promise.reject(new Error("Authentication failed. Please try again."));
  }
}

/* ------------------------- NextAuth Options ------------------------- */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone",
          type: "text",
          placeholder: "1231231231",
          required: true,
        },
        hashedPassword: {
          label: "Password",
          type: "password",
          required: true,
        },
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
      clientId: process.env.clientId || "",
      clientSecret: process.env.clientSecret || "",
    }),
  ],

  secret: process.env.JWT_SECRET || "secret",

  callbacks: {
    async session({ token, session }: any) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

    async signIn({ user }: any) {
      try {
        console.log("Google/Other User:", user);

        // Example user creation (test/demo)
        const dummyUser: CredentialsType = {
          phone: user.email,
          hashedPassword: user.name,
        };

        await db.user.create({
          data: {
            mobile: "9103597816",
            hashedPassword: "malikAaksh@1023",
          },
        });

        return true;
      } catch (error) {
        console.error("SignIn Error:", error);
        return false; // ❌ prevent login if DB insertion fails
      }
    },
  },

  pages: {
    error: "/auth/error", // custom error page
  },
};
