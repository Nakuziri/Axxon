'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchBoard } from '@/lib/api/getSingleBoard'
import { useState, useMemo } from 'react'
import { fetchCategories } from '@/lib/api/getCategories'
import { fetchLabels } from '@/lib/api/getLabels'
import { fetchTodosWithLabels } from '@/lib/api/getTodosWithLabels'
import { CategoryBaseData } from '@/lib/types/categoryTypes'
import { TodoWithLabels } from '@/lib/types/todoTypes'
import { useUpdateTodoMutation } from '@/lib/mutations/useUpdateTodo'
import { DndContext, closestCenter, DragEndEvent, DragStartEvent, useDroppable, useDraggable } from '@dnd-kit/core'

import DroppableColumn from './DroppableColumn'
import Modal from '@/components/features/boardView/CreateTodoModal'
import AddTodoForm from './CreateTodo'
import UpdateTodoModal from './UpdateTodoModal'// You’ll create this next


export default function BoardView({ boardId }: { boardId: string }) {
  //mutation hook for updating todo when dragged between categories
  const updateTodo = useUpdateTodoMutation(boardId)
  //used for create modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  //used for update modal
  const [selectedTodo, setSelectedTodo] = useState<TodoWithLabels | null>(null)
  //used for drag and drop
  const [activeTodo, setActiveTodo] = useState<TodoWithLabels | null>(null)

  function handleDragStart(event: DragStartEvent) {
    const todo = event.active.data.current?.todo as TodoWithLabels
    setActiveTodo(todo)
  }

  function handleDragEnd(event: DragEndEvent) {
    const todo = activeTodo
    const overCategoryId = Number(event.over?.id)
    const fromCategoryId = todo?.category_id

    if (todo && overCategoryId && overCategoryId !== fromCategoryId) {
      //Optimistically update the todo's category placement
      updateTodo.mutate({
        todoId: todo.id,
        data: { category_id: overCategoryId },
      })
    }

    setActiveTodo(null)
  }

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
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
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
          {categories.map((category) => (
            // handles todos within each category column
            <DroppableColumn
              key={category.id}
              categoryId={category.id}
              categoryName={category.name}
              todos={categorizedTodos[category.id] || []} // generates todos within each category column
              onTodoClick={setSelectedTodo}
            />
          ))}
        </div>
      </div>
    </DndContext>
  )
}
