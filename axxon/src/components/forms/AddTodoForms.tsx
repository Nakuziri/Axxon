'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTodo, NewTodoInput } from '@/lib/api/todos/createTodo';
import { useBoardMembers } from '@/hooks/UseBoardMembers';
import type { FormEvent } from 'react';

interface AddTodoFormProps {
  boardId: number;
  onClose?: () => void;
}

export default function AddTodoForm({ boardId, onClose }: AddTodoFormProps) {
  const queryClient = useQueryClient();
  const { data: members, isLoading: membersLoading } = useBoardMembers(boardId);

  const { mutate, status, error } = useMutation({
    mutationFn: (data: NewTodoInput) => createTodo(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', boardId] });
      onClose?.();
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: NewTodoInput = {
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      due_date: (formData.get('due_date') as string) || undefined,
      assignee_id: formData.get('assignee_id') ? Number(formData.get('assignee_id')) : undefined,
      priority: formData.get('priority') ? Number(formData.get('priority')) : undefined,
      category_id: formData.get('category_id') ? Number(formData.get('category_id')) : undefined,
    };

    mutate(data);
  };

  const isLoading = status === 'pending';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" required placeholder="Title" className="w-full p-2 border rounded" />
      <textarea name="description" placeholder="Description" className="w-full p-2 border rounded" />
      <input type="date" name="due_date" className="w-full p-2 border rounded" />

      {membersLoading ? (
        <p>Loading members...</p>
      ) : (
        <select name="assignee_id" className="w-full p-2 border rounded">
          <option value="">Unassigned</option>
          {members?.map((member: any) => (
            <option key={member.id} value={member.id}>
              {member.name || member.email}
            </option>
          ))}
        </select>
      )}

      <input type="number" name="priority" placeholder="Priority" className="w-full p-2 border rounded" />
      <input type="number" name="category_id" placeholder="Category ID" className="w-full p-2 border rounded" />

      <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-3 py-1 rounded">
        {isLoading ? 'Creating...' : 'Create Todo'}
      </button>
      {error && <p className="text-red-500">{(error as any).message}</p>}
    </form>
  );
}
