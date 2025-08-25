'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTodoById } from '@/lib/api/updateTodoById'
import { deleteTodoById } from '@/lib/api/deleteTodoById'
import type { TodoWithLabels } from '@/lib/types/todoTypes'

interface UpdateTodoModalProps {
  todo: TodoWithLabels
  boardId: string | number
  onClose: () => void
  onDelete?: () => void  
}


export default function UpdateTodoModal({ todo, boardId, onClose }: UpdateTodoModalProps) {
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description || '')
  const [priority, setPriority] = useState(todo.priority ? String(todo.priority) : '3') // default medium (assuming 3)
  const [assigneeId, setAssigneeId] = useState(todo.assignee_id ? String(todo.assignee_id) : '')

  const queryClient = useQueryClient()

  // Convert boardId and todo.id to numbers here to prevent NaN errors
const numericBoardId = !isNaN(Number(boardId)) ? Number(boardId) : null;
const numericTodoId = !isNaN(Number(todo.id)) ? Number(todo.id) : null;

// Always call hooks
const updateMutation = useMutation({
  mutationFn: (updatedData: any) =>
    numericBoardId !== null && numericTodoId !== null
      ? updateTodoById(numericBoardId, numericTodoId, updatedData)
      : Promise.reject('Invalid IDs'),
  onSuccess: () => {
    if (numericBoardId !== null) {
      queryClient.invalidateQueries({ queryKey: ['todos', numericBoardId] });
    }
    onClose();
  },
});

const deleteMutation = useMutation({
  mutationFn: () =>
    numericBoardId !== null && numericTodoId !== null
      ? deleteTodoById(numericBoardId, numericTodoId)
      : Promise.reject('Invalid IDs'),
  onSuccess: () => {
    if (numericBoardId !== null) {
      queryClient.invalidateQueries({ queryKey: ['todos', numericBoardId] });
    }
    onClose();
  },
});

// Render fallback UI for invalid IDs
if (numericBoardId === null || numericTodoId === null) {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <p className="text-red-600">Invalid board or todo ID.</p>
    </div>
  );
}


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // If assigneeId is empty string, convert to null to match your backend
    const assigneeIdValue = assigneeId.trim() === '' ? null : Number(assigneeId)
    if (assigneeIdValue !== null && isNaN(assigneeIdValue)) {
      alert('Assignee ID must be a number or empty')
      return
    }

    updateMutation.mutate({
      title,
      description,
      priority: Number(priority), // ensure priority is number
      assignee_id: assigneeIdValue,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow w-96">
        <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Todo title"
            required
          />
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
          />
          <select
            className="w-full p-2 border rounded"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="1">None</option>
            <option value="2">Low</option>
            <option value="3">Medium</option>
            <option value="4">High</option>
          </select>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            placeholder="Assignee ID (optional)"
          />
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
              <button
                type="button"
                onClick={onClose}
                className="text-sm border px-3 py-1 rounded"
              >
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
      </div>
    </div>
  )
}
