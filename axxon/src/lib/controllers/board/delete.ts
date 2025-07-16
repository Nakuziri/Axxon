import { NextResponse } from 'next/server';
import { Board } from '@/lib/models/board';

export async function deleteBoardController(id: number) {

  const result = await Board.deleteBoard({ id });
  return NextResponse.json({ success: !!result });
  
}
