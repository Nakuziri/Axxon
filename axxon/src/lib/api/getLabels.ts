// lib/api/getLabels.ts
export async function fetchLabels(boardId: string): Promise<{ id: number; board_id: number; name: string; color: string }[]> {
  const res = await fetch(`/api/board/${boardId}/labels`);
  if (!res.ok) throw new Error('Failed to fetch labels');
  return res.json();
}
