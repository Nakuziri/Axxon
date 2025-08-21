'use client'

/* libraries */ 
import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

/* api helpers */
import { getUserId } from '@/lib/api/getUserId'
import { fetchBoards } from '@/lib/api/getBoards'
import { deleteBoardById } from '@/lib/api/deleteBoardById'


 /* Components */ 
import BoardOptionsModal from '@/components/features/dashboard/BoardOptionsModal'
import InviteMembersModal from '@/components/features/dashboard/InviteMembersModal'
import EditBoardModal from '@/components/features/dashboard/EditBoardModal'

/* Types */
import { UpdateBoard } from '@/lib/types/boardTypes'

export default function BoardList() {
  const queryClient = useQueryClient()
  const [editingBoard, setEditingBoard] = useState<UpdateBoard | null>(null)
  const [selectedBoard, setSelectedBoard] = useState<UpdateBoard | null>(null)
  const [isInviteModalOpen, setInviteModalOpen] = useState(false)

  const {
    data: id,
    error: userError,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ['id'],
    queryFn: getUserId,
    staleTime: 5 * 60 * 1000,
  })

  const {
    data: boards = [],
    error: boardsError,
    isLoading: isBoardsLoading,
  } = useQuery({
    queryKey: ['boards', id],
    queryFn: () => fetchBoards(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })

  const deleteMutation = useMutation({
    mutationFn: (boardId: string) => deleteBoardById(boardId),
    onSuccess: () => {if(id)queryClient.invalidateQueries({ queryKey: ['boards', id] })},
  })

  if (isUserLoading || isBoardsLoading) return <div>Loading dashboard...</div>
  if (userError) return <div>Error loading user info</div>
  if (boardsError) return <div>Error loading boards</div>
  if (!id) return <div>Please log in to view your dashboard.</div>

  return (
<div className="w-70 h-screen overflow-y-auto p-3 border-gray-300 space-y-2">
  <h1 className="text-4xl text-center font-bold mb-6">Boards</h1>

  {boards.length === 0 ? (
    <p className="text-center text-gray-500">No boards yet.</p>
  ) : (
    <div className="h-[30%] overflow-y-auto pr-2 scrollbar-hidden space-y-3">
      {boards.map((board) => (
        <Link
          key={board.id}
          href={`/dashboard/${board.id}`}
          className="block"
        >
          <div
            className="p-4 rounded-xl shadow border border-gray-200 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            style={{ backgroundColor: board.color }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-lg font-semibold text-gray-900">
                {board.name}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedBoard(board);
                }}
                className="text-sm text-gray-800 hover:underline"
              >
                Options
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )}
      {editingBoard && (
        <EditBoardModal
          board={editingBoard}
          onClose={() => setEditingBoard(null)}
          onSuccess={() => {
            if (id) {
              queryClient.invalidateQueries({ queryKey: ['boards', id] })
            }
            setEditingBoard(null)
          }}
        />
      )}
      {selectedBoard && (
        <BoardOptionsModal
          board={selectedBoard}
          onClose={() => setSelectedBoard(null)}
          onEdit={() => setEditingBoard(selectedBoard)}
          onDelete={() => deleteMutation.mutate(selectedBoard.id)}
          onInvite={() => setInviteModalOpen(true)}
        />
      )}
      {isInviteModalOpen && selectedBoard && (
        <InviteMembersModal
          boardId={Number(selectedBoard.id)}
          onClose={() => setInviteModalOpen(false)}
        />
      )}
    </div>
  )
}
