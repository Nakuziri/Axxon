'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchBoard } from '@/lib/api/getSingleBoard'
import { useState, useMemo } from 'react'
import { fetchCategories } from '@/lib/api/getCategories'
import { fetchLabels } from '@/lib/api/getLabels'
import { fetchTodosWithLabels } from '@/lib/api/getTodosWithLabels'
import { CategoryBaseData } from '@/lib/models/types/categoryTypes'
import { TodoWithLabels } from '@/lib/models/types/todoTypes'
import Modal from '@/app/dashboard/[boardId]/CreateTodoModal'
import AddTodoForm from './createTodo'
import UpdateTodoModal from './UpdateTodoModal'// You’ll create this next

export default function BoardView({ boardId }: { boardId: string }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState<TodoWithLabels | null>(null)

  const { data: board } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId),
  })

  const { data: categories } = useQuery<CategoryBaseData[]>({
    queryKey: ['categories', boardId],
    queryFn: () => fetchCategories(boardId),
  })

  const { data: labels } = useQuery({
    queryKey: ['labels', boardId],
    queryFn: () => fetchLabels(boardId),
  })

  const { data: todos } = useQuery<TodoWithLabels[]>({
    queryKey: ['todos', boardId],
    queryFn: () => fetchTodosWithLabels(boardId),
  })

  const categorizedTodos = useMemo(() => {
    if (!todos || !categories) return {}
    return categories.reduce((acc, category) => {
      acc[category.id] = todos.filter(todo => todo.category_id === category.id)
      return acc
    }, {} as Record<number, TodoWithLabels[]>)
  }, [todos, categories])

  if (!board || !categories || !todos || !labels) {
    return <div>Loading board...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">{board.name}</h1>

      {/* Add Todo Button */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add Todo
      </button>

      {/* Add Todo Modal */}
      {isCreateModalOpen && (
        <Modal onClose={() => setIsCreateModalOpen(false)}>
          <AddTodoForm boardId={Number(boardId)} />
        </Modal>
      )}
      {/* Update Todo Modal */}
      {selectedTodo && (
        <Modal onClose={() => setSelectedTodo(null)}>
          <UpdateTodoModal
            todo={selectedTodo}
            boardId={boardId}  
            onClose={() => setSelectedTodo(null)}
            onDelete={() => {
              setSelectedTodo(null)
            }}
          />
        </Modal>
      )}
      {/* Categorized Todos */}
      <div className="flex flex-col gap-6">
        {categories.map(category => (
          <div key={category.id} className="bg-white shadow p-4 rounded-lg text-black">
            <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
            {categorizedTodos[category.id]?.length ? (
              categorizedTodos[category.id].map(todo => (
                <div
                  key={todo.id}
                  className="p-3 border rounded mb-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedTodo(todo)}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                    <p className="font-semibold">{todo.title}</p>
                    <p className="text-sm text-gray-700">{todo.description}</p>
                    <p className="text-sm text-gray-500">Assignee ID: {todo.assignee_id}</p>
                    <p className="text-sm text-gray-500">Priority: {todo.priority}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {todo.labels?.map(label => (
                      <span
                        key={label.id}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: label.color,
                          color: '#fff',
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No todos in this category</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
