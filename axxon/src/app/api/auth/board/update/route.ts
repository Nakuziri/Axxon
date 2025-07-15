import { NextRequest } from "next/server";
import { updateBoardController } from "@/lib/controllers/board/update";

export async function PATCH(req: NextRequest) {
    return await updateBoardController(req);
};