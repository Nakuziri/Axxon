// In your controller file
import { NextRequest, NextResponse} from "next/server";
import { Board } from "@/lib/models/board";

export async function listBoardCreatorController(_req: NextRequest, params: {id: string}) {
  try{
    const created_by = Number(params.id);

    const board = await Board.listAllByCreator({created_by});
    return NextResponse.json(board, {status: 200});
  }catch(error){
    console.error("[LIST_BY_BOARD_CREATOR_ERROR]", error);
    return NextResponse.json({error: 'failed to show boards made by user'}, {status: 500});
  }
}
