import { NextRequest } from 'next/server';
import { addBoardMembersByEmail } from '@/lib/controllers/boardMembers/boardMemberControllers';

export async function POST(req: NextRequest) {
  return await addBoardMembersByEmail(req);
}