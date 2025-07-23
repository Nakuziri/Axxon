import { PATCH as updateTodo, DELETE as deleteTodo, getTodoByIdController as getTodoById } from '@/lib/controllers/todos/todoControllers';
import type { NextRequest } from 'next/server';

export async function PATCH(req: NextRequest, context: { params: { boardId: string; todoId: string } }) {
  return updateTodo(req, context.params);
}

export async function DELETE(req: NextRequest, context: { params: { boardId: string; todoId: string } }) {
  return deleteTodo(req, context.params);
}

export async function GET(req: NextRequest, context: { params: { boardId: string; todoId: string } }) {
  return getTodoById(req, context.params);
}