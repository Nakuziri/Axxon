import { useState } from 'react'
import { inviteMembersByEmail } from "@/lib/api/inviteMembers";

type InviteMembersModalProps = {
  boardId: number
  onClose: () => void
}

export default function InviteMembersModal({ boardId, onClose }: InviteMembersModalProps ) {
  const [emails, setEmails] = useState<string[]>([])
  const [input, setInput] = useState('')

  const addEmail = () => {
    const newEmails = input.split(',').map(e => e.trim()).filter(Boolean)
    setEmails(prev => [...prev, ...newEmails])
    setInput('')
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-lg space-y-4 text-black">
        <h2 className="text-xl font-semibold">Invite Members</h2>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addEmail()}
          placeholder="Enter emails, comma separated"
          className="w-full p-2 border rounded"
        />
        <div className="flex flex-wrap gap-2">
          {emails.map((email, i) => (
            <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {email}
            </span>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600 hover:underline">Cancel</button>
          <button onClick={() => inviteMembersByEmail({ boardId, emails })}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send Invites
          </button>
        </div>
      </div>
    </div>
  )
}
