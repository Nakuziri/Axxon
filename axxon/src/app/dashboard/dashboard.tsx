'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { getUserId } from '@/lib/api/getUserId'
import { fetchBoards } from '@/lib/api/getBoards'

export default function Dashboard() {
  //gets user id and caches 
  const {
    data: id,
    error: userError,
    isLoading: isUserLoading,
  } = useQuery({    queryKey: ['id'], // Unique key identifying this query
    queryFn: getUserId,  // Function that fetches the user ID
    staleTime: 5 * 60 * 1000, // cache set for 5 min expirations 
  })
  console.log('user id from getUserId:', id);

  //sets up data, fetching for boards, and cache
  const {
    data: boards = [],
    error: boardsError,
    isLoading: isBoardsLoading,
  } = useQuery({
    queryKey: ['boards', id],
    queryFn: () => fetchBoards(id!),//fetches boards data
    enabled: !!id, //waits for id to be defined before fetching boards
    staleTime: 5 * 60 * 1000,// cache set for 5 min expirations
  })

  if (isUserLoading || isBoardsLoading) return <div>Loading dashboard...</div>
  if (userError) return <div>Error loading user info</div>
  if (boardsError) return <div>Error loading boards</div>
  if (!id) return <div>Please log in to view your dashboard.</div>


  return (
    <div>
      <h1 style={{ fontSize: '40px', textAlign: 'center' }}>Your Boards</h1>
      {boards.length === 0 ? (
        <p>No boards yet.</p>
      ) : (
        <ul>
          {boards.map((board) => (
            <li key={board.id} className="p-4 mb-4 bg-white rounded-lg shadow hover:shadow-lg border border-gray-200 transition-shadow">
              <Link href={`/dashboard/${board.id}`} className="block text-lg font-semibold text-gray-900">
                {board.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
