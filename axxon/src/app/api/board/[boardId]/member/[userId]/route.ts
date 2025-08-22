import { NextRequest, NextResponse } from 'next/server';
import { getMemberById, removeBoardMember } from '@/lib/controllers/boardMembers/boardMemberControllers';

// Helper to extract boardId and userId from the path
function getParams(req: NextRequest) {
  const parts = new URL(req.url).pathname.split('/');
  // ['', 'api', 'board', boardId, 'members', userId]
  const boardId = parts[3];
  const userId = parts[5];

  if (!boardId || !userId) {
    throw new Error('Missing boardId or userId');
  }

  return { boardId, userId };
}

export async function GET(req: NextRequest) {
  try {
    const { boardId, userId } = getParams(req);
    const member = await getMemberById(req, { boardId, userId });
    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { boardId, userId } = getParams(req);
    const result = await removeBoardMember(req, { boardId, userId });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
