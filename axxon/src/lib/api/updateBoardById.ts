export async function updateBoardById(id: string, data: { name?: string, color?: string }) {
  const res = await fetch(`/api/board/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update board');
  return res.json();
}
