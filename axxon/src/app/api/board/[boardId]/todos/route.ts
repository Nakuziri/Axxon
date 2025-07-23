import { POST as createTodo, GET as listTodos } from '@/lib/controllers/todos/todoControllers';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest, context: { params: { boardId: string } }) {
  return createTodo(req, context.params);
}

export async function GET(req: NextRequest, context: { params: { boardId: string } }) {
  return listTodos(req, context.params);
}