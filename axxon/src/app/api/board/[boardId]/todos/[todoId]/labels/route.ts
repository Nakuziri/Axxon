import { GET as getLabelsForTodo } from '@/lib/controllers/todoLabels/todoLabelControllers';
import type { NextRequest } from 'next/server';


export async function GET(req: NextRequest, context: { params: { boardId: string; todoId: string } }) {
  return getLabelsForTodo(req, context.params);
}
