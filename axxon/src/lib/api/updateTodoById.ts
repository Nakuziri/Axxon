export async function updateTodoById(boardId: string | number, todoId: string | number, data: any) {
  const res = await fetch(`/api/board/${boardId}/todos/${todoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update todo');
  }

  return res.json();
}
