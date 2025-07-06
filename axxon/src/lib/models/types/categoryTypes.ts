export type CategoryBase = {
  id: number;
  name: string;
  color: string | null;
  board_id: number;
  position: number;
  is_done: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateCategory = Pick<CategoryBase, 'name' | 'color' | 'board_id' | 'position' | 'is_done'>;
export type UpdateCategory = Partial<Pick<CategoryBase, 'name' | 'color' | 'position' | 'is_done'>> & { id: number };
export type DeleteCategory = Pick<CategoryBase, 'id'>;
export type ListCategoriesForBoard = Pick<CategoryBase, 'board_id'>;