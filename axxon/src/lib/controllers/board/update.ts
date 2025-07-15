import { NextRequest, NextResponse } from "next/server";
import { Board } from "@/lib/models/board";
import { UpdateBoard } from "@/lib/models/types/boardTypes";

export async function updateBoardController (req: NextRequest) {
        const data: UpdateBoard = await req.json();
        const board = await Board.updateBoard(data);
        return NextResponse.json(board,{status: 201});
}