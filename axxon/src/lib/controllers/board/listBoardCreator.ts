// In your controller file
import { NextResponse } from "next/server";
import { Board } from "@/lib/models/board";
import { ListBoardCreator } from "@/lib/models/types/boardTypes";

export async function listBoardCreatorController(data: ListBoardCreator) {
  const boards = await Board.listAllByCreator({ created_by: data.created_by });
  return NextResponse.json(boards, { status: 200 });
}
