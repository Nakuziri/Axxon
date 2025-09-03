// app/api/redis-test/route.ts
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

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
