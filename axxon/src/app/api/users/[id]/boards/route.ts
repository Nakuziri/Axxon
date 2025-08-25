import { GET as listAllBoardsForUsers } from '@/lib/controllers/boardMembers/boardMemberControllers';
import { NextRequest } from 'next/server';

// Helper to extract userId from the URL
function getUserId(req: NextRequest) {
  const parts = new URL(req.url).pathname.split('/');
  // ['', 'api', 'users', id, 'boards']
  return parts[3];
}

export async function GET(req: NextRequest) {
  const id = getUserId(req);
  return await listAllBoardsForUsers(req, { id });
}
