'use client'

import { useDraggable } from '@dnd-kit/core'
import { useRef } from 'react'
import { TodoWithLabels } from '@/lib/types/todoTypes'
import { LabelBaseData } from '@/lib/types/labelTypes'

export default function DraggableTodo({
  todo,
  onClick,
}: {
  todo: TodoWithLabels
  onClick: () => void
}) {

    // Initialize draggable hook for this todo item
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: todo.id,
        data: { todo },
    })

    // Apply transform styles for dragging
    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined

  // Track drag status
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const clickTimeout = useRef<NodeJS.Timeout | null>(null)

  // gets starting pointer position when mouse is pressed
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY }
  }

  // determines if mouseup is a click or drag based on distance moved
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return

    const dx = Math.abs(e.clientX - dragStartRef.current.x)
    const dy = Math.abs(e.clientY - dragStartRef.current.y)

    // Only treat as a click if pointer moved less than threshold
    const isClick = dx < 5 && dy < 5
    if (isClick) clickTimeout.current = setTimeout(onClick, 0)

    dragStartRef.current = null
  }

  return (
    <div
      ref={setNodeRef} // Required ref for draggable functionality
      {...listeners} // Draggable event listeners
      {...attributes} // Accessibility and other ARIA attributes
      style={style}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className="p-3 border rounded mb-3 bg-gray-50 hover:bg-gray-100 cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
        <p className="font-semibold">{todo.title}</p>
        <p className="text-sm text-gray-700">{todo.description}</p>
        <p className="text-sm text-gray-500">Assignee ID: {todo.assignee_id}</p>
        <p className="text-sm text-gray-500">Priority: {todo.priority}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {todo.labels?.map((label: LabelBaseData) => (
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
  )
}
