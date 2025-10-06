export const removeLabelFromTodo = async (
  boardId: number,
  todoId: number,
  labelId: number
): Promise<{ message: string }> => {
  const res = await fetch(`/api/board/${boardId}/todos/${todoId}/labels/${labelId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove label from todo');
  return res.json();
};
