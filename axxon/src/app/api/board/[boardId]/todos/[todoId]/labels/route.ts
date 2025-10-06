import { GET as getLabelsForTodo } from '@/lib/controllers/todoLabels/todoLabelControllers';
import type { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { boardId: string; todoId: string } }
) {
  return getLabelsForTodo(req, params);
}
