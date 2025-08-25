import { NextRequest, NextResponse } from 'next/server';
import { POST as createCategory, GET as listAllCategories } from '@/lib/controllers/categories/categoryControllers';

// Helper to extract boardId from the request URL
function getBoardId(req: NextRequest) {
  const parts = new URL(req.url).pathname.split('/');
  // ['', 'api', 'board', boardId, 'categories']
  return parts[3];
}

export async function POST(req: NextRequest) {
  const boardId = getBoardId(req);

  if (!boardId) {
    return NextResponse.json({ error: 'Missing boardId' }, { status: 400 });
  }

  return createCategory(req, { params: { boardId } });
}

export async function GET(req: NextRequest) {
  const boardId = getBoardId(req);

  if (!boardId) {
    return NextResponse.json({ error: 'Missing boardId' }, { status: 400 });
  }

  return listAllCategories(req, { boardId });
}
