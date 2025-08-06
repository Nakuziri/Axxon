'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTodo, NewTodoInput } from '@/lib/api/createTodo'; // wherever you saved it

export default function AddTodoForm({ boardId }: { boardId: number }) {
  const queryClient = useQueryClient();

    const { mutate, status, error } = useMutation({
    mutationFn: (data: NewTodoInput) => createTodo(boardId, data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos', boardId] });
    }
    });

    const isLoading = status === 'pending';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string || undefined,
      due_date: formData.get('due_date') as string || undefined,
      assignee_id: formData.get('assignee_id') ? Number(formData.get('assignee_id')) : undefined,
      priority: formData.get('priority') ? Number(formData.get('priority')) : undefined,
      category_id: formData.get('category_id') ? Number(formData.get('category_id')) : undefined
    };

    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required placeholder="Title" />
      <textarea name="description" placeholder="Description" />
      <input type="date" name="due_date" />
      <input type="number" name="assignee_id" placeholder="Assignee ID" />
      <input type="number" name="priority" placeholder="Priority" />
      <input type="number" name="category_id" placeholder="Category ID" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Todo'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
};
