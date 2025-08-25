import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import getQueryClient from '@/lib/utils/queryClient'
import { fetchBoards } from '@/lib/api/getBoards'
import { fetchCategories } from '@/lib/api/getCategories'
import { fetchTodos } from '@/lib/api/getTodos'
import { fetchLabels } from '@/lib/api/getLabels'
import BoardView from '../../../components/features/boardView/BoardView'
import { notFound } from 'next/navigation' 

export default async function BoardPage({ params }: any) {
  // Normalize boardId in case it comes as an array
  const boardId = Array.isArray(params.boardId) ? params.boardId[0] : params.boardId;

  const queryClient = getQueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['board', boardId],
        queryFn: () => fetchBoards(boardId),
      }),
      queryClient.prefetchQuery({
        queryKey: ['categories', boardId],
        queryFn: () => fetchCategories(boardId),
      }),
      queryClient.prefetchQuery({
        queryKey: ['todos', boardId],
        queryFn: () => fetchTodos(boardId),
      }),
      queryClient.prefetchQuery({
        queryKey: ['labels', boardId],
        queryFn: () => fetchLabels(boardId),
      }),
    ])
  } catch (error) {
    console.error('Prefetch error:', error)
    return notFound()
  }

  const dehydratedState = dehydrate(queryClient)

  return (
    <div className="flex flex-col gap-6">
      <HydrationBoundary state={dehydratedState}>
        <BoardView boardId={boardId} />
      </HydrationBoundary>
    </div>
  )
}
