export async function fetchBoard(boardId: string) {
  const res = await fetch(`/api/board/${boardId}`)
  if (!res.ok) {
    throw new Error('Failed to fetch board')
  }

  const data = await res.json()

  // ✅ Ensure it doesn't return undefined
  return data ?? null
}
