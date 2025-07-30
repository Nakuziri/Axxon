'use client'

import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { updateBoardById } from '@/lib/api/updateBoardById'

export default function EditBoardModal({ board, onClose, onSuccess }) {
  const [name, setName] = useState(board.name)
  const [color, setColor] = useState(board.color || '#000000')

  const updateMutation = useMutation({
    mutationFn: () => updateBoardById(board.id, { name, color }),
    onSuccess,
  })

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Enter') {
        e.preventDefault() // prevent form submission if inside a form
        updateMutation.mutate()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [name, color, onClose, updateMutation])

  return (
    <div className="fixed inset-0 bg-gray-400/50 flex justify-center items-center z-50">
      <div className="bg-black p-6 rounded-2xl shadow w-96">
        <h2 className="text-xl font-bold mb-4">Edit Board</h2>
        <input
          type="text"
          className="w-full p-2 mb-3 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Board name"
          autoFocus
        />
        <input
          type="color"
          className="w-full mb-4"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-sm">
            Cancel
          </button>
          <button
            onClick={() => updateMutation.mutate()}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
