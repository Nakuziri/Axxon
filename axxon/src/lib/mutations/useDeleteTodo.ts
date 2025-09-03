// hooks/useDeleteTodoMutation.ts
import { useMutation } from "@tanstack/react-query";
import { deleteTodoById } from "@/lib/api/deleteTodoById"; // your API call

export function useDeleteTodoMutation(boardId: string) {

  return useMutation({
    mutationFn: async (todoId: number) => {
      // Sends DELETE request to server
      return await deleteTodoById(boardId, todoId);
    },
    // No onMutate; no optimistic deletion
    onError: (err) => {
      console.error("Failed to delete todo:", err);
    },
    onSuccess: () => {
      // Does NOT manually remove from cache; WebSocket will handle it
    },
  });
}
