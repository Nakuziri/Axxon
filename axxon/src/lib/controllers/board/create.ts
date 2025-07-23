import { NextRequest, NextResponse } from 'next/server';
import { Board } from '@/lib/models/board'; 
import { BoardCreation } from '@/lib/models/types/boardTypes';

export async function createBoardController (req: NextRequest) {
    try{
        const data: BoardCreation = await req.json();//tells the variable what shape the incoming json should be in 
        const board = await Board.createBoard(data);//passes that data to the creation model 
        return NextResponse.json(board, { status: 201 });//returns it to the user in json 
    } catch (error) {
        console.error('Create board error:', error);
        return NextResponse.json({ message: 'Failed to create board' }, { status: 500 });
    }
}