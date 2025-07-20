import { NextRequest } from 'next/server';
import { addBoardMembersByEmail, getAllMembersInBoard } from '@/lib/controllers/boardMembers/boardMemberControllers';

export async function POST(req: NextRequest) {
  return await addBoardMembersByEmail(req);
}

export async function GET(_req: NextRequest, { params }: { params: { boardId: string } }) {
  const boardId = Number(params.boardId);
  return await getAllMembersInBoard(boardId);
}