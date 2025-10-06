'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings } from 'lucide-react'

import { getUserId } from '@/lib/api/users/getUserId'
import { fetchBoards } from '@/lib/api/boards/getBoards'
import { deleteBoardById } from '@/lib/api/boards/deleteBoardById'

import Modal from '@/components/ui/Modal'
import BoardOptionsForm from '@/components/forms/BoardOptionsForm'

import type { UpdateBoard } from '@/lib/types/boardTypes'

export default function BoardList() {
  const queryClient = useQueryClient()
  const [selectedBoard, setSelectedBoard] = useState<UpdateBoard | null>(null)

  // -------------------------------
  // Queries
  // -------------------------------
  const { data: id, error: userError, isLoading: isUserLoading } = useQuery({
    queryKey: ['id'],
    queryFn: getUserId,
    staleTime: 5 * 60 * 1000,
  })

  const { data: boards = [], error: boardsError, isLoading: isBoardsLoading } = useQuery({
    queryKey: ['boards', id],
    queryFn: () => fetchBoards(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })

  // -------------------------------
  // Mutations
  // -------------------------------
  const deleteMutation = useMutation({
    mutationFn: (boardId: string) => deleteBoardById(boardId),
    onSuccess: () => {
      if (id) queryClient.invalidateQueries({ queryKey: ['boards', id] })
    },
  })

  // -------------------------------
  // Loading / Error States
  // -------------------------------
  if (isUserLoading || isBoardsLoading) return <div>Loading dashboard...</div>
  if (userError) return <div>Error loading user info</div>
  if (boardsError) return <div>Error loading boards</div>
  if (!id) return <div>Please log in to view your dashboard.</div>

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="w-[93%] h-screen overflow-y-auto p-2 m-3 border-gray-300 space-y-2">
      <h1 className="text-4xl text-center font-bold mb-6">Boards</h1>

      {boards.length === 0 ? (
        <p className="text-center text-gray-500">No boards yet.</p>
      ) : (
        <div className="h-[30%] overflow-y-auto pr-2 scrollbar-hidden space-y-3">
          {boards.map((board) => (
            <Link key={board.id} href={`/dashboard/${board.id}`} className="block">
              <div
                className="p-4 rounded-xl shadow border border-gray-200 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                style={{ backgroundColor: board.color || '#000000' }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg font-semibold text-gray-900">
                    {board.name || 'Untitled Board'}
                  </span>
                  <Settings
                    className="w-5 h-5 text-gray-700 hover:text-black cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setSelectedBoard(board)
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* -------------------------------
          Board Options Modal
      ------------------------------- */}
      {selectedBoard && (
        <Modal
          isOpen={!!selectedBoard}
          onClose={() => setSelectedBoard(null)}
          title={`Manage "${selectedBoard.name}"`}
        >
          <BoardOptionsForm
            board={selectedBoard}
            onClose={() => setSelectedBoard(null)}
            onDelete={() => {
              deleteMutation.mutate(String(selectedBoard.id))
              setSelectedBoard(null)
            }}
            onSuccess={() => {
              if (id) queryClient.invalidateQueries({ queryKey: ['boards', id] })
              setSelectedBoard(null)
            }}
          />
        </Modal>
      )}
    </div>
  )
}
