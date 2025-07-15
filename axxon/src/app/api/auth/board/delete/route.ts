import { NextRequest } from "next/server";
import { deleteBoardController } from "@/lib/controllers/board/delete";

export async function DELETE(req: NextRequest){
    return await deleteBoardController(req);
}