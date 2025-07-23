import { NextRequest } from "next/server";
import { listBoardCreatorController } from "@/lib/controllers/board/listBoardCreator";

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  return await listBoardCreatorController(_req, context.params);
}
