import { Labels } from "@/lib/models/labels";
import { CreateLabelData, DeleteLabelData, ListAllLabelsData, UpdateLabelData } from "@/lib/models/types/labelTypes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data: CreateLabelData = await req.json();
    const label = await Labels.createLabel(data);
    return NextResponse.json(label, { status: 201 }); // 201 is more semantically correct for a creation
  } catch (error) {
    console.error('[CREATE_LABEL_ERROR]', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to create label' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { boardId: string } }) {
  try {
    const board_id = params.boardId;
    const labels = await Labels.listAllLabelsInBoard({board_id});
    return NextResponse.json(labels, { status: 200 });
  } catch (error) {
    console.error('[LIST_ALL_LABELS_ERROR]', error);
    return NextResponse.json({ error: 'failed to list out all labels' }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest ) {
    try {
        const data: UpdateLabelData = await req.json();
        const label = await Labels.updateLabel(data);
        return NextResponse.json(label, {status: 200});
    } catch (error) {
        console.error('[UPDATE_LABEL_ERROR]', error);
        return NextResponse.json({ error: "failed to update label"}, {status: 500})
    }
}


export async function DELETE(req: NextRequest) {
    try {
        const data: DeleteLabelData = await req.json();
        const deleted = await Labels.deleteLabel(data);
        return NextResponse.json(deleted, {status: 200});
    } catch (error) {
        console.error('[DELETE_LABEL_ERROR]', error);
        return NextResponse.json({error: 'Failed to delete the label'}, {status: 500});
    }
}

