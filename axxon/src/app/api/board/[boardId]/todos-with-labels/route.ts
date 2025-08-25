// src/app/api/board/[boardId]/todos-with-labels/route.ts
'use server';

import { NextResponse } from 'next/server';
import { TodoLabels } from '@/lib/models/todoLabels';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const boardId = Number(url.pathname.split('/')[3]); 
  // /api/board/[boardId]/todos-with-labels

  if (isNaN(boardId)) {
    return NextResponse.json({ error: 'Invalid boardId' }, { status: 400 });
  }

  const enrichedTodos = await TodoLabels.getTodosWithLabels(boardId);
  return NextResponse.json(enrichedTodos);
}
