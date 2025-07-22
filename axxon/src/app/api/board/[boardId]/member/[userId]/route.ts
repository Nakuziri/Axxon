import { getMemberById, removeBoardMember } from '@/lib/controllers/boardMembers/boardMemberControllers';
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, context: {params: {boardId: string; userId: string; }}){
  return await getMemberById(_req, context.params);
}

export async function DELETE(_req: NextRequest, context: {params: {boardId: string; userId: string; }}) {
  return await removeBoardMember(_req, context.params);
}
