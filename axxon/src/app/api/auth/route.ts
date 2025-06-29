import { handleOAuthLogin } from "@/lib/controllers/authController";
import { NextRequest } from "next/server";

//nextjs routes handle requests and responses differently 
export async function POST(req: NextRequest) {
    return handleOAuthLogin(req);
}