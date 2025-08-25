import { getBoardById } from '@/lib/controllers/board/getById';
import { updateBoardController } from '@/lib/controllers/board/update';
import { deleteBoardController } from '@/lib/controllers/board/delete';
import { NextRequest } from 'next/server';

// Parse boardId from URL directly to bypass context typing issue
function extractBoardId(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/'); // ['', 'api', 'board', boardId]
  return segments[3];
}

// Gets board by id
export async function GET(req: NextRequest) {
  const boardId = extractBoardId(req);
  return await getBoardById(req, { boardId });
}

// Updates board by id
export async function PATCH(req: NextRequest) {
  const boardId = extractBoardId(req);
  return await updateBoardController(req, { boardId });
}

// Deletes board by id
export async function DELETE(req: NextRequest) {
  const boardId = extractBoardId(req);
  return await deleteBoardController(req, { boardId });
}
