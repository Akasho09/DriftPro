import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
  port: 11113 ,
  maxRetriesPerRequest: 5,
  enableReadyCheck: true,
});

redis.on("connect", () => console.log("Redis connected!"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;
