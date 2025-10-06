import { LabelBaseData } from '@/lib/types/labelTypes'

export type UpdateLabelInput = {
  name?: string
  color?: string
}

export const updateLabel = async (boardId: number, labelId: number, data: UpdateLabelInput): Promise<LabelBaseData> => {
  const res = await fetch(`/api/board/${boardId}/labels/${labelId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update label')
  return res.json()
}
