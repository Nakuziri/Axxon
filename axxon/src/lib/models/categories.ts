import knex from '@/lib/db/db';
import type { CategoryBaseData, CreateCategory, UpdateCategory, DeleteCategory, ListCategoriesForBoard, GetCategoryById } from '../types/categoryTypes';
import { getAvailableColor } from '../utils/colorPicker';

export class Categories {

  static createCategory = async (data: CreateCategory): Promise<CategoryBaseData> => {
    
    const color = await getAvailableColor('categories', data.board_id, data.color);

    // Get count of categories for the board if position is not provided
    const positionCount = await knex('categories')
    .where({ board_id: data.board_id })
    .count('*')
    .first();

    // Use provided position or fallback to total count
    const finalPosition = data.position ?? parseInt(positionCount?.count as string, 10);

    // Insert category
    const [category] = await knex('categories')
      .insert({
        board_id: data.board_id,
        name: data.name,
        color,
        position: finalPosition,
        is_done: data.is_done ?? false,
      })
      .returning('*');

    return category;
  };

  static updateCategory = async (data: UpdateCategory): Promise<CategoryBaseData> => {
    const { id, board_id, position, ...rest } = data;

    // Start a transaction to safely handle position shifts
    return await knex.transaction(async (trx) => {
      // Shift positions only if a new position is provided
      if (position !== undefined) {
        // Get all other categories in the same board
        const otherCategories = await trx('categories')
          .where({ board_id })
          .andWhereNot({ id })
          .orderBy('position', 'asc');

        const newPositions: Record<number, number> = {};

        // Recalculate positions to make room for the updated category
        let currentPos = 1;
        for (const cat of otherCategories) {
          if (currentPos === position) currentPos++; // skip the new position
          newPositions[cat.id] = currentPos;
          currentPos++;
        }

        // Update other categories' positions
        for (const [catId, newPos] of Object.entries(newPositions)) {
          await trx('categories')
            .where({ id: Number(catId) })
            .update({ position: newPos });
        }
      }

      // Update the target category
      const [updatedCategory] = await trx('categories')
        .where({ id })
        .update({
          ...rest,
          ...(position !== undefined ? { position } : {}),
          updated_at: trx.fn.now(),
        })
        .returning('*');

      return updatedCategory;
    });
  };


  static deleteCategory = async (data: DeleteCategory): Promise<number> =>{
        return await knex('categories')
        .where({id : data.id})
        .del();
  };

  static listAllCategoriesInBoard = async (data: ListCategoriesForBoard): Promise<CategoryBaseData[]> => {
        return await knex('categories')
        .where({ board_id : data.board_id })
        .orderBy('position','asc')//orders descending by numerical vallue of position
        .select('*');
  };

  static getCategoryById = async (data: GetCategoryById): Promise<CategoryBaseData | null> =>{
    return await knex('categories').where({id: data.id}).first() || null
  };
}