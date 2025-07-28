// /app/api/board/[boardId]/todos-with-labels/route.ts

import { NextResponse } from 'next/server';
import db from '@/lib/db/db'; // or wherever you access Knex

export async function GET(_: Request, { params }: { params: { boardId: string } }) {
  const boardId = Number(params.boardId);

  // 1. Fetch all todos for this board
  const todos = await db('todos')
    .where({ board_id: boardId })
    .select('*');

  if (!todos.length) return NextResponse.json([]);

  const todoIds = todos.map(todo => todo.id);

  // 2. Fetch todo-label relations
  const todoLabels = await db('todo_labels')
    .whereIn('todo_id', todoIds);

  const labelIds = [...new Set(todoLabels.map(rel => rel.label_id))];

  // 3. Fetch all relevant labels
  const labels = await db('labels')
    .whereIn('id', labelIds);

  // 4. Build label lookup
  const labelMap = labels.reduce((acc, label) => {
    acc[label.id] = label;
    return acc;
  }, {} as Record<number, { id: number; name: string; color: string }>);

  // 5. Attach labels to each todo
  const enrichedTodos = todos.map(todo => ({
    ...todo,
    labels: todoLabels
      .filter(rel => rel.todo_id === todo.id)
      .map(rel => labelMap[rel.label_id])
      .filter(Boolean)
  }));

  return NextResponse.json(enrichedTodos);
}
