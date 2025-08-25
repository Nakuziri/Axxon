import { NextRequest } from "next/server";
import { listBoardCreatorController } from "@/lib/controllers/board/listBoardCreator";

// Helper to extract userId from the URL
function getUserId(req: NextRequest) {
  const parts = new URL(req.url).pathname.split('/');
  // ['', 'api', 'users', id, 'boards', 'created']
  return parts[3];
}

export async function GET(req: NextRequest) {
  const id = getUserId(req);
  return await listBoardCreatorController(req, { id });
}
