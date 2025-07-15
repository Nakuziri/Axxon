import { NextRequest, NextResponse } from 'next/server';
import { DeleteBoard } from '@/lib/models/types/boardTypes';
import { Board } from '@/lib/models/board';

export async function deleteBoardController(req: NextRequest) {
  try {
    const data: DeleteBoard = await req.json();
    const result = await Board.deleteBoard(data);

    if (!result) {
      return NextResponse.json({ error: 'Board not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Board deleted successfully' }, { status: 200 });
    
  } catch (err) {
    console.error('Delete board error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
