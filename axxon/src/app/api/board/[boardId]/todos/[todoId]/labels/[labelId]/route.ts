import { POST as addLabelToTodo, DELETE as removeLabelFromTodo } from '@/lib/controllers/todoLabels/todoLabelControllers';
import type { NextRequest } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { boardId: string; todoId: string; labelId: string } }
) {
  return addLabelToTodo(req, params);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { boardId: string; todoId: string; labelId: string } }
) {
  return removeLabelFromTodo(req, params);
}
