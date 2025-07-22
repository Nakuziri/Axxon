import { NextRequest, NextResponse } from "next/server";
import { Board } from "@/lib/models/board";
import { UpdateBoard } from "@/lib/models/types/boardTypes";

export async function updateBoardController(req: NextRequest, params: { boardId: string;}) {
  try{
    const id = Number(params.boardId);
    const data = await req.json();

    const updateData: UpdateBoard = { id, ...data };

    const board = await Board.updateBoard(updateData);//passes through method
    return NextResponse.json(board, { status: 200 });//returns updated data
  }catch(error){
    console.error('[UPDATE_BOARD_ERROR]', error);
    return NextResponse.json({error: 'failed to update board'}, {status: 500});
  }
}
