'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchBoard } from '@/lib/api/getSingleBoard'
import { useState } from 'react';
import { fetchCategories } from '@/lib/api/getCategories'
import { fetchLabels } from '@/lib/api/getLabels'
import { fetchTodosWithLabels } from '@/lib/api/getTodosWithLabels'
import { CategoryBaseData } from '@/lib/models/types/categoryTypes'
import { TodoWithLabels } from '@/lib/models/types/todoTypes'
import { useMemo } from 'react'
import Modal from '@/components/ui/CreateTodoModal';
import AddTodoForm from './createTodo';


export default function BoardView({ boardId }: { boardId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <div>
        {/* Board content here */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Todo
        </button>

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <AddTodoForm boardId={Number(boardId)} />
          </Modal>
        )}
      </div>
      <div className="flex flex-col gap-6">
        {categories.map(category => (
          <div key={category.id} className="bg-white shadow p-4 rounded-lg text-black text-shadow-amber-50">
            <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
            {categorizedTodos[category.id]?.length ? (
              categorizedTodos[category.id].map(todo => (
                <div key={todo.id} className="p-3 border rounded mb-3 text-black bg-transparent shadow-sm ">
                  <div className="flex justify-between mb-2 font-lg ">
                    <p>{todo.title}</p>
                    <p>{todo.description}</p>
                    <p>Assignee ID  {todo.assignee_id}</p>
                    <p>Priority: {todo.priority}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {todo.labels?.map(label => (
                      <span
                        key={label.id}
                        className="text-xs px-3 py-1 rounded-full bg-gray-200"
                        style={{ backgroundColor: label.color, color: '#fff' }}
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
