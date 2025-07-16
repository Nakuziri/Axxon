import { listBoardCreatorController } from "@/lib/controllers/board/listBoardCreator";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest){
    return await listBoardCreatorController(req);
}