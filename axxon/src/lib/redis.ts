// lib/redis.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Optional: listen for errors so they don’t silently fail
redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redis;
