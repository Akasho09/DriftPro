import { z } from "zod";

// ✅ Zod schema for input validation
export const signupSchema = z.object({
  phone: z
    .string(),
    // .regex(/^[6-9]\d{9}$/, "Invalid mobile number. Must be 10 digits starting with 6–9."),
  password: z
    .string()
    // .min(8, "Password must be at least 8 characters long.")
    // .regex(/[A-Z]/, "Password must include at least one uppercase letter.")
    // .regex(/[a-z]/, "Password must include at least one lowercase letter.")
    // .regex(/[0-9]/, "Password must include at least one number.")
    // .regex(/[^A-Za-z0-9]/, "Password must include at least one special character."),
});