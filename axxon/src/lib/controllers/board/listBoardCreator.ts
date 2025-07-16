import { NextRequest, NextResponse } from 'next/server';
import { Board } from '@/lib/models/board';
import { ListBoardCreator } from '@/lib/models/types/boardTypes';

export async function listBoardCreatorController(req: NextRequest) {
  const url = new URL(req.url);
  const createdByParam = url.searchParams.get('created_by');

  const created_by = Number(createdByParam);
  const data: ListBoardCreator = { created_by };

  const boards = await Board.listAllByCreator(data);

  return NextResponse.json(boards, { status: 200 });
}