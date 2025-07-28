import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create board')
      return res.json()
    },
    onSuccess: () => {
      // Invalidate board list to refetch new board
      queryClient.invalidateQueries({ queryKey: ['boards'] })
    },
  })
}
