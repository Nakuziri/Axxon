import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateTodo(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { title: string; description?: string; categoryId?: string }) => {
      const res = await fetch(`/api/board/${boardId}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create todo')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', boardId] })
    },
  })
}
