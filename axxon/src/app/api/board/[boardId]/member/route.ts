import { NextRequest } from 'next/server';
import { addBoardMembersByEmail, getAllMembersInBoard } from '@/lib/controllers/boardMembers/boardMemberControllers';

export async function POST(req: NextRequest, context: { params: { boardId: string }}) {
  return await addBoardMembersByEmail(req, context.params);
}

export async function GET(_req: NextRequest, context:{ params: { boardId: string; }}) {
  return await getAllMembersInBoard(_req, context.params);
}