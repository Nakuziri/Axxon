import { POST as addLabelToTodo, DELETE as removeLabelFromTodo } from '@/lib/controllers/todoLabels/todoLabelControllers';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const boardId = segments[3];
  const todoId = segments[5];
  const labelId = segments[7];

  return addLabelToTodo(req, { boardId, todoId, labelId });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split('/');
  const boardId = segments[3];
  const todoId = segments[5];
  const labelId = segments[7];

  return removeLabelFromTodo(req, { boardId, todoId, labelId });
}
