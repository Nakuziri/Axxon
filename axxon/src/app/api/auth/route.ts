//This route might be utilized in the future if additional login/signup approaches are implemented

import { handleOAuthLogin } from "@/lib/controllers/auth/authController";
import { NextRequest } from "next/server";

//nextjs routes handle requests and responses differently 
export async function POST(req: NextRequest) {
    return handleOAuthLogin(req);
}