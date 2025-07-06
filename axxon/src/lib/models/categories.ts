import knex from '@/lib/db/db';
import type { CategoryBase, CreateCategory, UpdateCategory, DeleteCategory, ListCategoriesForBoard } from './types/categoryTypes';

export class Categories {
  id: number;
  name: string;
  color: string | null;
  board_id: number;
  position: number;
  is_done: boolean;
  created_at: string;
  updated_at: string;

  constructor({id, name, color, board_id, created_at, updated_at, position, is_done}: CategoryBase) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.board_id = board_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.position = position;
    this.is_done = is_done;
  }

    static createCategory = async (data: CreateCategory): Promise<CategoryBase> => {
    const fallbackColors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#22D3EE',
      '#A855F7', '#EAB308', '#4ADE80', '#F43F5E', '#94A3B8',
    ];

    // Get existing colors on this board
    const usedColors = await knex('categories')
      .where({ board_id: data.board_id })
      .select('color');
    const existingColors = usedColors.map(c => c.color);
    const availableColors = fallbackColors.filter(
      color => !existingColors.includes(color)
    );

    // Picks a color
    const color =
      data.color ??
      (availableColors.length > 0
        ? availableColors[Math.floor(Math.random() * availableColors.length)]
        : '#9CA3AF'); // default to gray

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

    static updateCategory = async (data: UpdateCategory): Promise<CategoryBase> => {
    const {id, ...updateData } = data;

    // Add updated_at timestamp to updateData
    const updateWithTimestamp = {
      ...updateData,
      updated_at: knex.fn.now(), // This sets it to the current timestamp
    };
        const [category] = await knex('categories')
         .where({id})
         .update(updateWithTimestamp)
         .returning('*')
        
        return category;
    };

    static deleteCategory = async (data: DeleteCategory): Promise<number> =>{
        return await knex('categories')
        .where({id : data.id})
        .del();
    }

    static listAllCategoriesInBoard = async (data: ListCategoriesForBoard): Promise<CategoryBase[]> => {
        return await knex('categories')
        .where({ board_id : data.board_id })
        .orderBy('position','asc')//orders descending by numerical vallue of position
        .select('*');
    }
  }
