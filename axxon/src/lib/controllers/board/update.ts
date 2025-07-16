import { NextRequest, NextResponse } from "next/server";
import { Board } from "@/lib/models/board";
import { BoardBaseData, UpdateBoard } from "@/lib/models/types/boardTypes";

export async function updateBoardController(req: NextRequest, id: number) {
  const data: Partial<Pick<BoardBaseData, 'name'>> = await req.json();
  const updateData: UpdateBoard = { id, ...data };//deconstruct data to use id for queries
  const board = await Board.updateBoard(updateData);//passes through method
  return NextResponse.json(board, { status: 200 });//returns updated data
}
