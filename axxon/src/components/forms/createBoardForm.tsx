'use client'

import { useState } from 'react'
import { createBoard } from '@/lib/api/boards/createBoard'

interface CreateBoardFormProps {
  onSuccess?: () => void
  onClose?: () => void
}

export default function CreateBoardForm({ onSuccess, onClose }: CreateBoardFormProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#000000')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return setError('Board name cannot be empty')

    setLoading(true)
    setError(null)

    try {
      await createBoard({ name: name.trim(), color })
      onSuccess?.()
      onClose?.()
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Board Name */}
      <div>
        <label htmlFor="board-name" className="block mb-1 font-medium">
          Board Name
        </label>
        <input
          id="board-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter board name"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Board Color */}
      <div>
        <label htmlFor="board-color" className="block mb-1 font-medium">
          Board Color
        </label>
        <input
          id="board-color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-16 h-10 p-0 border-none cursor-pointer"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Board'}
        </button>
      </div>
    </form>
  )
}
