import { NextRequest } from "next/server";
import { listBoardCreatorController } from "@/lib/controllers/board/listBoardCreator";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const data = { created_by: Number(params.id) };
  return await listBoardCreatorController(data);
}
