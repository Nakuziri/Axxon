// app/api/redis-test/route.ts
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

/**
 * HTTP GET handler that writes a test key to Redis, reads it back, and returns the result as JSON.
 *
 * Sets the key `"test:ping"` to `"pong"` with a 30-second TTL, then reads the value and returns
 * `{ success: true, key: "test:ping", value }` on success. On error returns a 500 JSON response
 * `{ success: false, error }`.
 *
 * @returns A NextResponse containing the JSON result object.
 */
export async function GET() {
  try {
    // write test value
    await redis.set("test:ping", "pong", "EX", 30); // expire in 30s

    // read it back
    const value = await redis.get("test:ping");

    return NextResponse.json({
      success: true,
      key: "test:ping",
      value,
    });
  } catch (err: any) {
    console.error("Redis error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
