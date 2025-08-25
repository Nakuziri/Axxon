'use client'

import { useState } from 'react'
import { getUserId } from '@/lib/api/getUserId'

export default function CreateBoardForm() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const userId = await getUserId()
    if (!userId) {
      console.error('User not authenticated')
      setLoading(false)
      return
    }

    const res = await fetch('/api/board', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, created_by: userId }),
    })

    setLoading(false)
    if (!res.ok) return console.error('Failed to create board')

    const board = await res.json()
    console.log('Board created:', board)
    setName('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Board name"
        className="p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? 'Creating...' : 'Create Board'}
      </button>
    </form>
  )
}
