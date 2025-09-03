// hooks/useUpdateTodoMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodoById } from "@/lib/api/updateTodoById";
import { TodoWithLabels } from "@/lib/types/todoTypes";

export function useUpdateTodoMutation(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // This mutation updates a todo item by its ID
    mutationFn: async ({ todoId, data }: { todoId: number; data: Partial<TodoWithLabels> }) => {
      return await updateTodoById(boardId, todoId, data);
    },

    // Optimistic update
    onMutate: async ({ todoId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["todos", boardId] });

      // Get current todos for optimistic update
      const prevTodos = queryClient.getQueryData<TodoWithLabels[]>(["todos", boardId]);

      // Optimistic patch
      queryClient.setQueryData<TodoWithLabels[]>(["todos", boardId], (old) =>
        old
          ? old.map((todo) =>
              todo.id === todoId ? { ...todo, ...data } : todo
            )
          : []
      );

      return { prevTodos };
    },

    onError: (_err, _vars, context) => {
      // Roll back if mutation fails
      if (context?.prevTodos) {
        queryClient.setQueryData(["todos", boardId], context.prevTodos);
      }
    },

    onSuccess: (updatedTodo) => {
      // Extra safety: patch cache with server response immediately
      queryClient.setQueryData<TodoWithLabels[]>(["todos", boardId], (old) =>
        old
          ? old.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
          : [updatedTodo]
      );

    },
  });
}
