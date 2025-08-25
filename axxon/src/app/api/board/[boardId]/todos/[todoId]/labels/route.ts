import { GET as getLabelsForTodo } from '@/lib/controllers/todoLabels/todoLabelControllers';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathParts = url.pathname.split('/');

  const boardId = pathParts[3];
  const todoId = pathParts[5];  

  return getLabelsForTodo(req, { boardId, todoId });
}
