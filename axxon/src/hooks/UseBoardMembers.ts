// lib/hooks/useBoardMembers.ts
import { useQuery } from '@tanstack/react-query';
import { getBoardMembers } from '@/lib/api/members/getBoardMembers';

export const useBoardMembers = (boardId: number) =>
  useQuery({
    queryKey: ['boardMembers', boardId],
    queryFn: () => getBoardMembers(boardId),
  });
