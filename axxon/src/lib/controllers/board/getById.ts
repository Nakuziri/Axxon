import { Board } from "@/lib/models/board";
import { NextResponse } from "next/server";


export async function getBoardById(id: number) {
    const board = await Board.getBoardById(id);
    return NextResponse.json(board, { status: 200 });
}
