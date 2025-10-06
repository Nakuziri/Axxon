import { NextRequest, NextResponse } from 'next/server';
import {
  getAllMembersInBoard,
  addBoardMembersByEmail,
} from '@/lib/controllers/boardMembers/boardMemberControllers';

// Helper to extract boardId from the request URL
function getParams(req: NextRequest) {
  const parts = new URL(req.url).pathname.split('/');
  // ['', 'api', 'board', boardId, 'member']
  const boardId = parts[3];

  if (!boardId) throw new Error('Missing boardId');
  return { boardId };
}

// ------------------------------------------------------------------
// GET → Get all members in a board
// ------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const { boardId } = getParams(req);
    const members = await getAllMembersInBoard(req, { boardId });
    return members; // controllers already return NextResponse
  } catch (error) {
    console.error('[BOARD_MEMBERS_FETCH_ERROR]', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch board members' },
      { status: 400 }
    );
  }
}

// ------------------------------------------------------------------
// POST → Add members to a board by email
// ------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const { boardId } = getParams(req);
    const response = await addBoardMembersByEmail(req, { boardId });
    return response; // controllers already return NextResponse
  } catch (error) {
    console.error('[BOARD_MEMBER_ADD_ERROR]', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to add members' },
      { status: 400 }
    );
  }
}
