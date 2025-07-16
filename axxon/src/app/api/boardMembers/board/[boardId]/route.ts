import { getAllMembersInBoard } from '@/lib/controllers/boardMembers/boardMemberControllers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { boardId: string } }) {
  const boardId = Number(params.boardId);
  return await getAllMembersInBoard(boardId);
}