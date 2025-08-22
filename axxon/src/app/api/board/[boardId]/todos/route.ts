import { POST as createTodo, GET as listTodos } from '@/lib/controllers/todos/todoControllers';
import type { NextRequest } from 'next/server';

// Helper to extract boardId from the request URL
function getBoardId(req: NextRequest) {
  const parts = new URL(req.url).pathname.split('/');
  // ['', 'api', 'board', boardId, 'todos']
  return parts[3];
}

export async function POST(req: NextRequest) {
  const boardId = getBoardId(req);
  return createTodo(req, { boardId });
}

export async function GET(req: NextRequest) {
  const boardId = getBoardId(req);
  return listTodos(req, { boardId });
}
