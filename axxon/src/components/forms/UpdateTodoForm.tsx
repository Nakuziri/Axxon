import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTodoById } from '@/lib/api/todos/updateTodoById';
import { deleteTodoById } from '@/lib/api/todos/deleteTodoById';
import { useBoardMembers } from '@/hooks/UseBoardMembers';
import type { TodoWithLabels } from '@/lib/types/todoTypes';

interface UpdateTodoFormProps {
  todo: TodoWithLabels;
  boardId: string | number;
  onClose?: () => void;
  onDelete?: () => void;
}

export default function UpdateTodoForm({ todo, boardId, onClose, onDelete }: UpdateTodoFormProps) {
  const queryClient = useQueryClient();
  const numericBoardId = Number(boardId);
  const numericTodoId = Number(todo.id);

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [priority, setPriority] = useState(todo.priority ? String(todo.priority) : '3');
  const [assigneeId, setAssigneeId] = useState(todo.assignee_id ? String(todo.assignee_id) : '');

  const { data: members, isLoading: membersLoading } = useBoardMembers(numericBoardId);

  const updateMutation = useMutation({
    mutationFn: (updatedData: any) => updateTodoById(numericBoardId, numericTodoId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', numericBoardId] });
      onClose?.();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTodoById(numericBoardId, numericTodoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', numericBoardId] });
      onClose?.();
      onDelete?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      title,
      description,
      priority: Number(priority),
      assignee_id: assigneeId ? Number(assigneeId) : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 border rounded" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" />

      <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2 border rounded">
        <option value="1">None</option>
        <option value="2">Low</option>
        <option value="3">Medium</option>
        <option value="4">High</option>
      </select>

      {membersLoading ? (
        <p>Loading members...</p>
      ) : (
        <select
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Unassigned</option>
          {members?.map((m: any) => (
            <option key={m.id} value={m.id}>
              {m.name || m.email}
            </option>
          ))}
        </select>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          onClick={() => deleteMutation.mutate()}
          className="text-sm text-red-600 hover:underline"
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="text-sm border px-3 py-1 rounded">
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
}
