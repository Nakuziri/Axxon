// src/lib/api/getCategories.ts

export async function fetchCategories(boardId: string) {
  const res = await fetch(`/api/board/${boardId}/categories`)

  if (!res.ok) {
    throw new Error('Failed to fetch categories')
  }

  return res.json()
}