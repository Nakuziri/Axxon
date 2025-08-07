import { NextRequest, NextResponse } from 'next/server';
import { TodoLabels } from '@/lib/models/todoLabels';
import type {
  AddLabelToTodo,
  RemoveLabelFromTodo,
  GetLabelsOnTodo,
} from '@/lib/types/todoLabelTypes';

// Add a label to a todo (POST /board/[boardId]/todos/[todoId]/labels)
export async function POST(_req: NextRequest, params: { boardId: string; todoId: string; labelId: string }) {
  try {
    const todo_id = Number(params.todoId);
    const label_id = Number(params.labelId);

    const data: AddLabelToTodo = { todo_id, label_id };
    const todoLabel = await TodoLabels.addLabelToTodo(data);

    return NextResponse.json(todoLabel, { status: 201 });
  } catch (error) {
    console.error('[ADD_LABEL_TO_TODO_ERROR]', error);
    return NextResponse.json({ error: 'Failed to add label to todo' }, { status: 500 });
  }
}


// Remove a label from a todo (DELETE /board/[boardId]/todos/[todoId]/labels/[labelId])
export async function DELETE(_req: NextRequest, params: { boardId: string; todoId: string; labelId: string }
) {
  try {
    const todo_id = Number(params.todoId);
    const label_id = Number(params.labelId);

    const data: RemoveLabelFromTodo = { todo_id, label_id };
    const removed = await TodoLabels.removeLabelFromTodo(data);

    return NextResponse.json({ removed }, { status: 200 });
  } catch (error) {
    console.error('[REMOVE_LABEL_FROM_TODO_ERROR]', error);
    return NextResponse.json({ error: 'Failed to remove label from todo' }, { status: 500 });
  }
}

// Get all labels for a todo (GET /board/[boardId]/todos/[todoId]/labels)
export async function GET(_req: NextRequest, params: { boardId: string; todoId: string }) {
  try {
    const todo_id = Number(params.todoId);
    const data: GetLabelsOnTodo = { todo_id };
    const labels = await TodoLabels.getLabelsForTodo(data);

    return NextResponse.json(labels, { status: 200 });
  } catch (error) {
    console.error('[GET_LABELS_FOR_TODO_ERROR]', error);
    return NextResponse.json({ error: 'Failed to get labels for todo' }, { status: 500 });
  }
}
