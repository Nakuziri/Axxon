// /lib/api/getTodosWithLabels.ts

export async function fetchTodosWithLabels(boardId: string) {
  const res = await fetch(`/api/board/${boardId}/todos-with-labels`);

  if (!res.ok) {
    throw new Error('Failed to fetch todos with labels');
  }

  return res.json();
}
