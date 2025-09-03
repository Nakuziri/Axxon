'use client'
// Libraries
import { useState, useMemo} from 'react'
import { useQuery } from '@tanstack/react-query'
import { DndContext, closestCenter, DragEndEvent, DragStartEvent } from '@dnd-kit/core'

//Hooks 
import { useSocket } from '@/hooks/useSocket'
import { useBoardRealtime } from '@/hooks/useBoardRealtime'
import { useUpdateTodoMutation } from '@/lib/mutations/useUpdateTodo'
import { useDeleteTodoMutation } from '@/lib/mutations/useDeleteTodo'

//API Fetchers
import { fetchBoard } from '@/lib/api/getSingleBoard'
import { fetchCategories } from '@/lib/api/getCategories'
import { fetchLabels } from '@/lib/api/getLabels'
import { fetchTodosWithLabels } from '@/lib/api/getTodosWithLabels'

//Components
import DroppableColumn from './DroppableColumn'
import Modal from '@/components/features/boardView/CreateTodoModal'
import AddTodoForm from './CreateTodo'
import UpdateTodoModal from './UpdateTodoModal'

//Types
import type { CategoryBaseData } from '@/lib/types/categoryTypes'
import type { TodoWithLabels } from '@/lib/types/todoTypes'

/**
 * Renders a draggable kanban-style board for a given board ID.
 *
 * Establishes a socket connection and real-time updates for the board, fetches board
 * data (categories, labels, todos with labels), and renders todos grouped by category.
 * Provides UI to create, update, and delete todos via modals, and supports dragging
 * todos between columns — on drop it updates the todo's category using a mutation.
 *
 * @param boardId - The board identifier (string) to load and operate on
 * @returns A React element containing the board view and associated modals
 */
export default function BoardView({ boardId }: { boardId: string }) {

  // --- Socket & Realtime ---
  const socketRef = useSocket(boardId)
  useBoardRealtime(boardId, socketRef)

  // --- Local State ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState<TodoWithLabels | null>(null)
  const [activeTodo, setActiveTodo] = useState<TodoWithLabels | null>(null)

  // --- Mutations ---
  const updateTodo = useUpdateTodoMutation(boardId)
  const deleteTodo = useDeleteTodoMutation(boardId)

  // --- Queries ---
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
    select: (data) => [...data], // Ensure we always get a new reference when cache changes
  })

  // --- Categorize Todos ---
  const categorizedTodos = useMemo(() => {
    if (!todos || !categories) return {}
    return categories.reduce((acc, category) => {
      acc[category.id] = todos.filter(todo => todo.category_id === category.id)
      return acc
    }, {} as Record<number, TodoWithLabels[]>)
  }, [todos, categories])

  // --- Drag & Drop ---
  function handleDragStart(event: DragStartEvent) {
    const todo = event.active.data.current?.todo as TodoWithLabels
    setActiveTodo(todo)
  }

  function handleDragEnd(event: DragEndEvent) {
    const todo = activeTodo
    const overCategoryId = Number(event.over?.id)
    const fromCategoryId = todo?.category_id

    if (todo && overCategoryId && overCategoryId !== fromCategoryId) {
      updateTodo.mutate({ todoId: todo.id, data: { category_id: overCategoryId } })
    }

    setActiveTodo(null)
  }

  // --- Loading State ---
  if (!board || !categories || !todos || !labels) return <div>Loading board...</div>

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">{board.name}</h1>

        {/* Add Todo Button */}
        <button onClick={() => setIsCreateModalOpen(true)} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">
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
                if (selectedTodo) deleteTodo.mutate(selectedTodo.id)
                setSelectedTodo(null)
              }}
            />
          </Modal>
        )}

        {/* Categorized Todos */}
        <div className="flex flex-col gap-6">
          {categories.map(category => (
            <DroppableColumn
              key={category.id}
              categoryId={category.id}
              categoryName={category.name}
              todos={categorizedTodos[category.id] || []}
              onTodoClick={setSelectedTodo}
            />
          ))}
        </div>
      </div>
    </DndContext>
  )
}
