import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, "100 s"),
  analytics: true,
});

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(15, "100 s"),
  analytics: true,
});