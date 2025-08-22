import { NextRequest, NextResponse } from 'next/server';
import {
  getLabelByIdController,
  PATCH as updateLabel,
  DELETE as deleteLabel,
} from '@/lib/controllers/labels/labelControllers';

// Helper to extract boardId and labelId from the path
function getParams(req: NextRequest) {
  const parts = new URL(req.url).pathname.split('/');
  // ['', 'api', 'board', boardId, 'labels', labelId]
  const boardId = parts[3];
  const labelId = parts[5];

  if (!boardId || !labelId) {
    throw new Error('Missing boardId or labelId');
  }

  return { boardId, labelId };
}

export async function GET(req: NextRequest) {
  try {
    const { boardId, labelId } = getParams(req);
    const label = await getLabelByIdController(req, { boardId, labelId });
    return NextResponse.json(label);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { boardId, labelId } = getParams(req);
    const updatedLabel = await updateLabel(req, { boardId, labelId });
    return NextResponse.json(updatedLabel);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { boardId, labelId } = getParams(req);
    const deletedLabel = await deleteLabel(req, { boardId, labelId });
    return NextResponse.json(deletedLabel);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
