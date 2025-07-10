export type CategoryBaseData = {
  id: number;
  name: string;
  color: string;
  board_id: number;
  position: number;
  is_done: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateCategory = Pick<CategoryBaseData, 'name' | 'color' | 'board_id' | 'position' | 'is_done'>;
export type UpdateCategory = Partial<Pick<CategoryBaseData, 'name' | 'color' | 'position' | 'is_done'>> & { id: number };
export type DeleteCategory = Pick<CategoryBaseData, 'id'>;
export type ListCategoriesForBoard = Pick<CategoryBaseData, 'board_id'>;
export type GetCategoryById = Pick<CategoryBaseData, 'id'>