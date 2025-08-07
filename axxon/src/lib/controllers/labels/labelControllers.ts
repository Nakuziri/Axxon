import { NextRequest, NextResponse } from 'next/server';
import { Labels } from '@/lib/models/labels';
import type { CreateLabelData, UpdateLabelData } from '@/lib/types/labelTypes';

// Create Label (POST /board/[boardId]/labels)
export async function POST(req: NextRequest, params: { boardId: string } ) {
  try {
    const board_id = Number(params.boardId);
    const body = await req.json();

    const data: CreateLabelData = { ...body, board_id };
    const label = await Labels.createLabel(data);

    return NextResponse.json(label, { status: 201 });
  } catch (error) {
    console.error('[CREATE_LABEL_ERROR]', error);
    return NextResponse.json({ error: 'Failed to create label' }, { status: 500 });
  }
}

// List Labels in Board (GET /board/[boardId]/labels)
export async function GET(_req: NextRequest, params: { boardId: string } ) {
  try {
    const board_id = Number(params.boardId);
    const labels = await Labels.listAllLabelsInBoard({ board_id });

    return NextResponse.json(labels, { status: 200 });
  } catch (error) {
    console.error('[LIST_LABELS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to list labels' }, { status: 500 });
  }
}

// Update Label (PATCH /board/[boardId]/labels/[labelId])
export async function PATCH(req: NextRequest, params: { boardId: string; labelId: string } ) {
  try {
    const id = Number(params.labelId);
    const board_id = Number(params.boardId);
    const body = await req.json();

    const data: UpdateLabelData = { ...body, id, board_id };
    const label = await Labels.updateLabel(data);

    return NextResponse.json(label, { status: 200 });
  } catch (error) {
    console.error('[UPDATE_LABEL_ERROR]', error);
    return NextResponse.json({ error: 'Failed to update label' }, { status: 500 });
  }
}

// Delete Label (DELETE /board/[boardId]/labels/[labelId])
export async function DELETE(_req: NextRequest, params: { boardId: string; labelId: string } ) {
  try {
    const id = Number(params.labelId);
    const deleted = await Labels.deleteLabel({ id });

    return NextResponse.json({ deleted }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_LABEL_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete label' }, { status: 500 });
  }
}

// Get Label by ID (GET /board/[boardId]/labels/[labelId])
export async function getLabelByIdController(_req: NextRequest, params: { boardId: string; labelId: string } ) {
  try {
    const id = Number(params.labelId);
    const label = await Labels.getLabelById({ id });

    return NextResponse.json(label, { status: 200 });
  } catch (error) {
    console.error('[GET_LABEL_BY_ID_ERROR]', error);
    return NextResponse.json({ error: 'Failed to retrieve label' }, { status: 500 });
  }
}
