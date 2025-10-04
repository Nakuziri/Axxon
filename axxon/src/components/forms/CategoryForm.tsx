'use client'

import { useState } from 'react'
import { CategoryBaseData } from '@/lib/types/categoryTypes'

interface CategoryFormProps {
  category: CategoryBaseData
  onSave: (updates: Partial<CategoryBaseData>) => void
  onDelete: (id: number) => void
  onClose: () => void
}

export default function UpdateCategoryForm({ category, onSave, onDelete, onClose }: CategoryFormProps) {
  const [name, setName] = useState(category.name)
  const [color, setColor] = useState(category.color || '#cccccc')
  const [isDone, setIsDone] = useState(!!category.is_done)
  const [loading, setLoading] = useState(false)

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)
    onSave({ name, color, is_done: isDone })
    setLoading(false)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this category?')) {
      onDelete(category.id)
      onClose()
    }
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <label className="flex flex-col">
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-2 py-1 mt-1"
        />
      </label>

      <label className="flex flex-col">
        Color
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-16 h-8 mt-1 p-0 border-none"
        />
      </label>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => setIsDone((prev) => !prev)}
        />
        Mark as Done
      </label>

      <div className="flex justify-between mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Cancel
      </button>
    </form>
  )
}
