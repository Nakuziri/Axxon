import { LabelBaseData } from '@/lib/types/labelTypes'

export type CreateLabelInput = {
  name: string
  color: string
}

export const createLabel = async (boardId: number, data: CreateLabelInput): Promise<LabelBaseData> => {
  const res = await fetch(`/api/board/${boardId}/labels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create label')
  return res.json()
}
