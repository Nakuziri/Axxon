export type NewTodoInput = {
  title: string;
  description?: string;
  due_date?: string;
  assignee_id?: number;
  priority?: number;
  category_id?: number;
};

export const createTodo = async (
  boardId: number,
  data: NewTodoInput
): Promise<any> => {
  const res = await fetch(`/api/board/${boardId}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'Failed to create todo');
  }

  return res.json();
};
