export async function deleteBoardById(id: string) {
  const res = await fetch(`/api/board/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'Failed to delete board');
  }

  return res.json();
}
