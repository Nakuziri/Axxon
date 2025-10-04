// lib/hooks/categories/useCreateCategory.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCategory } from '@/lib/api/categories/createCategory';

export function useCreateCategory(boardId: string | number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; color?: string; position?: number }) =>
      createCategory(boardId, data),

    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ['categories', boardId] });

      const prevCategories = queryClient.getQueryData<any[]>([
        'categories',
        boardId,
      ]) || [];

      // Create a temporary optimistic category with a fake id
      const tempCategory: any = {
        id: Date.now(), // temporary id
        board_id: Number(boardId),
        name: newCategory.name,
        color: newCategory.color || '#cccccc',
        position: newCategory.position ?? prevCategories.length,
        todos: [],
      };

      queryClient.setQueryData<any[]>(
        ['categories', boardId],
        [...prevCategories, tempCategory]
      );

      return { prevCategories };
    },

    onError: (_err, _newCategory, context) => {
      if (context?.prevCategories) {
        queryClient.setQueryData(['categories', boardId], context.prevCategories);
      }
    },

    onSuccess: (savedCategory) => {
      queryClient.setQueryData<any[]>(
        ['categories', boardId],
        (old) =>
          old?.map((cat) =>
            typeof cat.id === 'number' && String(cat.id).length > 10
              ? savedCategory
              : cat
          ) ?? []
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', boardId] });
    },
  });
}
