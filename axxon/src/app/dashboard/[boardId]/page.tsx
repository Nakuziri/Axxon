import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import getQueryClient from '@/lib/utils/queryClient'
import { fetchBoard } from '@/lib/api/boards/getSingleBoard'
import { fetchCategories } from '@/lib/api/categories/getCategories'
import { fetchTodos } from '@/lib/api/todos/getTodos'
import { fetchLabels } from '@/lib/api/labels/getLabels'
import BoardView from '../../../components/features/boardView/BoardView'
import { notFound } from 'next/navigation' 

export default async function BoardPage({ params }: any) {
  const resolvedParams = await params;
  const boardId = Array.isArray(resolvedParams.boardId) 
    ? resolvedParams.boardId[0] 
    : resolvedParams.boardId;

  const queryClient = getQueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ['board', boardId],
        queryFn: () => fetchBoard(boardId),
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
    ]);
  } catch (error) {
    console.error('Prefetch error:', error);
    return notFound();
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="flex flex-col gap-6">
      <HydrationBoundary state={dehydratedState}>
        <BoardView boardId={boardId} />
      </HydrationBoundary>
    </div>
  );
}

