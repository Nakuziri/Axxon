// lib/api/categories/createCategory.ts
export async function createCategory(
  boardId: string | number,
  data: { name: string; color?: string; position?: number }
) {
  const res = await fetch(`/api/board/${boardId}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'Failed to create category');
  }

  return res.json();
}
