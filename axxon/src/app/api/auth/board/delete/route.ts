import { NextRequest } from "next/server";
import { deleteBoardController } from "@/lib/controllers/board/deleteBoard";

export async function DELETE(req: NextRequest){
    return await deleteBoardController(req);
}