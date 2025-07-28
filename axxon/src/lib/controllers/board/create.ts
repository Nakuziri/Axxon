import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Board } from '@/lib/models/board'; 
import { BoardCreation } from '@/lib/models/types/boardTypes';
import jwt from 'jsonwebtoken';

export async function createBoardController(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    const userId = decoded.id;

    const data: BoardCreation = await req.json();

    // Merge userId into data
    const board = await Board.createBoard({
      ...data,
      created_by: userId, 
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error('Create board error:', error);
    return NextResponse.json({ message: 'Failed to create board' }, { status: 500 });
  }
}
