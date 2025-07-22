import { Board } from "@/lib/models/board";
import { NextRequest, NextResponse } from "next/server";


export async function getBoardById(_req: NextRequest, params: {boardId: string}) {
   try{
        const id = Number(params.boardId);
        const board = await Board.getBoardById(id);

        return NextResponse.json(board, { status: 200 });
    }catch(error){
        console.error('[GET_BOARD_BY_ID_ERROR]', error);
        return NextResponse.json({error: 'failed to get board by id'}, {status: 500});
    }
}
