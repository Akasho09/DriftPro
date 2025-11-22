import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: 2,
  enableReadyCheck: true,
});

redis.on("connect", () => console.log("Redis connected!"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;
