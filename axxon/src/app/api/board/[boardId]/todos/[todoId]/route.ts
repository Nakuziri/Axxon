import { PATCH as updateTodo, DELETE as deleteTodo, getTodoByIdController as getTodoById } from '@/lib/controllers/todos/todoControllers';
import type { NextRequest } from 'next/server';

// Helper to extract boardId and todoId from the URL
function getIds(req: NextRequest) {
  const parts = new URL(req.url).pathname.split('/');
  // ['', 'api', 'board', boardId, 'todos', todoId]
  const boardId = parts[3];
  const todoId = parts[5];
  return { boardId, todoId };
}

export async function PATCH(req: NextRequest) {
  const { boardId, todoId } = getIds(req);
  return updateTodo(req, { boardId, todoId });
}

export async function DELETE(req: NextRequest) {
  const { boardId, todoId } = getIds(req);
  return deleteTodo(req, { boardId, todoId });
}

export async function GET(req: NextRequest) {
  const { boardId, todoId } = getIds(req);
  return getTodoById(req, { boardId, todoId });
}