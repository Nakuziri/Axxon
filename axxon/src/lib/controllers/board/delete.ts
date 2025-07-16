import { NextResponse } from 'next/server';
import { Board } from '@/lib/models/board';
import { DeleteBoard } from '@/lib/models/types/boardTypes';

export async function deleteBoardController(data: DeleteBoard) {
  const result = await Board.deleteBoard({id: data.id});
  return NextResponse.json({ success: !!result });
}
