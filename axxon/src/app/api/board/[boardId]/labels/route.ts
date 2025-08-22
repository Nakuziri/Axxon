import { NextRequest, NextResponse } from 'next/server';
import { POST as createLabel, GET as listLabels } from '@/lib/controllers/labels/labelControllers';

// Helper to extract boardId from the request URL
function getBoardId(req: NextRequest) {
  const parts = new URL(req.url).pathname.split('/');
  // ['', 'api', 'board', boardId, 'labels']
  const boardId = parts[3];

  if (!boardId) {
    throw new Error('Missing boardId');
  }

  return boardId;
}

export async function POST(req: NextRequest) {
  try {
    const boardId = getBoardId(req);
    const newLabel = await createLabel(req, { boardId });
    return NextResponse.json(newLabel);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const boardId = getBoardId(req);
    const labels = await listLabels(req, { boardId });
    return NextResponse.json(labels);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
