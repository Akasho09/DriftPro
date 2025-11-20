import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
  port: 13364,
  maxRetriesPerRequest: 2,
  enableReadyCheck: true,
});

redis.on("connect", () => console.log("Redis connected!"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;
