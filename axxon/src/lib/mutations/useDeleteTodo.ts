// hooks/useDeleteTodoMutation.ts
import { useMutation } from "@tanstack/react-query";
import { deleteTodoById } from "@/lib/api/deleteTodoById"; /**
 * React Query mutation hook for deleting a todo on a specific board.
 *
 * Creates a mutation that calls the API to delete a todo by ID for the given board.
 * Errors are logged to the console; successful removal from client state is not performed here
 * because the application relies on WebSocket updates to synchronize cache/state.
 *
 * @param boardId - ID of the board that contains the todo to delete
 * @returns A React Query mutation object (result of `useMutation`) configured with the delete operation
 */

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
