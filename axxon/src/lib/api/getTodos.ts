// src/lib/api/getTodos.ts

export async function fetchTodos(boardId: string) {
  const res = await fetch(`/api/board/${boardId}/todos`)

  if (!res.ok) {
    throw new Error('Failed to fetch todos')
  }

  return res.json()
}
