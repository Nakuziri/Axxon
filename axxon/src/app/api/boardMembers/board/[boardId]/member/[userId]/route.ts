import { getMemberById, removeBoardMember } from '@/lib/controllers/boardMembers/boardMemberControllers';
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { boardId: string; userId: string } }) {
  const data = {
    board_id: Number(params.boardId),
    user_id: Number(params.userId),
  };

  return await getMemberById(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { boardId: string; userId: string } }) {
  const data = {
    board_id: Number(params.boardId),
    user_id: Number(params.userId),
  };

  return await removeBoardMember(data);
}