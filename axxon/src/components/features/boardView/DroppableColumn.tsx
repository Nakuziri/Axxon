'use client'

//this component is a droppable column that holds draggable todos
//it renders all of the boards categories
import { useDroppable } from '@dnd-kit/core'
import { TodoWithLabels } from '@/lib/models/types/todoTypes'
import DraggableTodo from './DraggableTodo'

export default function DroppableColumn({
  categoryId,
  categoryName,
  todos,
  onTodoClick,
}: {
  categoryId: number
  categoryName: string
  todos: TodoWithLabels[]
  onTodoClick: (todo: TodoWithLabels) => void
}) {
  const { setNodeRef } = useDroppable({ id: categoryId })

  return (
    <div ref={setNodeRef} className="bg-white shadow p-4 rounded-lg text-black">
      <h2 className="text-xl font-semibold mb-4">{categoryName}</h2>
      {todos?.length ? (
        todos.map((todo) => (
          <DraggableTodo
            key={todo.id}
            todo={todo}
            onClick={() => onTodoClick(todo)}
          />
        ))
      ) : (
        <p className="text-gray-500">No todos in this category</p>
      )}
    </div>
  )
}
