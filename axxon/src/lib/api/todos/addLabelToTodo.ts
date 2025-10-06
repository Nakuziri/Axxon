export const addLabelToTodo = async (
  boardId: number,
  todoId: number,
  labelId: number
): Promise<{ message: string }> => {
  const res = await fetch(`/api/board/${boardId}/todos/${todoId}/labels/${labelId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to add label to todo');
  return res.json();
};
