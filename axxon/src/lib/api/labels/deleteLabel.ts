export const deleteLabel = async (boardId: number, labelId: number): Promise<{ message: string }> => {
  const res = await fetch(`/api/board/${boardId}/labels/${labelId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete label')
  return res.json()
}
