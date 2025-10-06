'use client'

import { useState } from 'react'
import { updateBoardById } from '@/lib/api/boards/updateBoardById'
import { inviteMembersByEmail } from '@/lib/api/members/inviteMembers'

import type { UpdateBoard } from '@/lib/types/boardTypes'
import { number } from 'framer-motion'

interface BoardOptionsFormProps {
  board: UpdateBoard
  onClose: () => void
  onDelete: () => void
  onSuccess: () => void
}

export default function BoardOptionsForm({ board, onClose, onDelete, onSuccess }: BoardOptionsFormProps) {
  const [name, setName] = useState(board.name)
  const [color, setColor] = useState(board.color || '#000000')
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // -------------------------------
  // Add member to list
  // -------------------------------
  const handleAddEmail = () => {
    if (!newEmail.trim()) return
    setEmails((prev) => [...prev, newEmail.trim()])
    setNewEmail('')
  }

  // -------------------------------
  // Save board changes
  // -------------------------------
  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      await updateBoardById(board.id, { name, color })
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Error updating board')
    } finally {
      setLoading(false)
    }
  }

  // -------------------------------
  // Send invitations
  // -------------------------------
  const handleInvite = async () => {
    if (emails.length === 0) return
    try {
      setLoading(true)
      await inviteMembersByEmail({boardId: Number(board.id), emails})
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Error inviting members')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Board Editing Section */}
      <section className="space-y-3">
        <h3 className="font-semibold text-lg text-gray-900">Edit Board</h3>

        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-16 h-10 border-none cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Save Changes
          </button>

          <button
            onClick={onDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            Delete Board
          </button>
        </div>
      </section>

      {/* Member Invitation Section */}
      <section className="space-y-3 border-t border-gray-300 pt-4">
        <h3 className="font-semibold text-lg text-gray-900">Add Members</h3>

        <div className="flex gap-2">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter email"
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <button
            type="button"
            onClick={handleAddEmail}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Add
          </button>
        </div>

        {emails.length > 0 && (
          <ul className="text-sm text-gray-700 space-y-1">
            {emails.map((email, idx) => (
              <li key={idx}>• {email}</li>
            ))}
          </ul>
        )}

        <button
          onClick={handleInvite}
          disabled={loading || emails.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          Send Invites
        </button>
      </section>
    </div>
  )
}
 