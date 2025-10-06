// src/lib/api/boards/createBoard.ts
export type NewBoardInput = {
  name: string
  color?: string
}

export const createBoard = async (data: NewBoardInput) => {
  const res = await fetch('/api/board', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error('Failed to create board')
  }

  return res.json()
}
