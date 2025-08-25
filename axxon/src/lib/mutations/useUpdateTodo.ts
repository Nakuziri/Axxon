import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTodoById } from '@/lib/api/updateTodoById'
import { TodoWithLabels } from '@/lib/types/todoTypes'

export function useUpdateTodoMutation(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ todoId, data }: { todoId: number; data: Partial<TodoWithLabels> }) =>
      updateTodoById(boardId, todoId, data),

    onMutate: async ({ todoId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['todos', boardId] })

      const prevTodos = queryClient.getQueryData<TodoWithLabels[]>(['todos', boardId])

      // Optimistically update todos in cache
      queryClient.setQueryData<TodoWithLabels[]>(['todos', boardId], (old) =>
        old
          ? old.map((todo) =>
              todo.id === todoId ? { ...todo, ...data } : todo
            )
          : []
      )

      return { prevTodos }
    },

    onError: (_err, _vars, context) => {
      if (context?.prevTodos) {
        queryClient.setQueryData(['todos', boardId], context.prevTodos)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', boardId] })
    },
  })
}
