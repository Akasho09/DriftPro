import Redis from "ioredis";

const redis = new Redis({
  host: "redis-13364.crce217.ap-south-1-1.ec2.redns.redis-cloud.com",
  port: 13364,           // plain TCP port
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 5,
  enableReadyCheck: true,
});

redis.on("connect", () => console.log("Redis connected!"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;
