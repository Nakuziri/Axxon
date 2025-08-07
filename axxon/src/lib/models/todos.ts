import knex from '@/lib/db/db'
import { CreateTodoData, DeleteTodoData, GetTodoByIdData, GetTodoByNameData, ListAllTodosData, TodoBaseData, UpdateTodoData, GetTodoByCompletionData, GetTodoByAssigneeData, GetTodoByStatusData, SearchTodoByTitle} from '../types/todoTypes'

export class Todos {
    
    static createTodo = async (data: CreateTodoData): Promise<TodoBaseData> => {
    const {
        board_id,
        title,
        description,
        due_date,
        assignee_id,
        priority,
        category_id,
        is_complete
    } = data;

    let finalCategoryId = category_id;

    if (!finalCategoryId) {
        const defaultCategory = await knex('categories')
        .where({ board_id })
        .orderBy('position', 'asc')
        .first();

        if (!defaultCategory) {
        throw new Error(`No default category found for board_id: ${board_id}`);
        }

        finalCategoryId = defaultCategory.id;
    }

    const [todo] = await knex('todos')
        .insert({
        board_id,
        title,
        description: description ?? null,
        due_date: due_date ?? null,
        assignee_id: assignee_id ?? null,
        priority: priority ?? null,
        category_id: finalCategoryId,
        is_complete: is_complete ?? false
        })
        .returning('*');

    return todo;
    };

    static deleteTodo = async(data: DeleteTodoData): Promise<number> => {
        return await knex('todos')
        .where({id: data.id})
        .del();
        
    };

    static updateTodo = async(data: UpdateTodoData): Promise<TodoBaseData | null> => {
        const {id, ...updateData } = data;

        const [todo] = await knex('todos')
        .where({id})
        .update(updateData)
        .returning('*')

        return todo || null;
    };

    static listTodosInBoard = async(data: ListAllTodosData): Promise<TodoBaseData[]> => {
        return await knex('todos')
        .where({board_id: data.board_id})
        .orderBy('id','desc');
    };

    //used for cShecking dupes on todo cration
    static getTodoByName = async(data: GetTodoByNameData): Promise<TodoBaseData | null> => {
        const todo = await knex ('todos')
        .where({ title: data.title, board_id: data.board_id})
        .first();
        
        return todo || null;
    };

    //used for editing and detailed todo view
    static getTodoById = async (data: GetTodoByIdData): Promise<TodoBaseData | null> => {
        const todo = await knex('todos')
        .where({ id: data.id })
        .first();

        return todo || null;
    };

    static filterByCompletion = async (data: GetTodoByCompletionData): Promise<TodoBaseData[]> => {
        return await knex('todos')
        .where({ is_complete: data.is_complete })
        .orderBy('id', 'desc');
    };

    static filterByAssignee = async (data: GetTodoByAssigneeData): Promise<TodoBaseData[]> => {
        return await knex('todos')
        .where({
            board_id: data.board_id,
            assignee_id: data.assignee_id
        })
        .orderBy('id', 'desc');
    };

    static filterByStatusState = async (data: GetTodoByStatusData): Promise<TodoBaseData[]> => {
        return await knex('todos')
        .where({
            board_id: data.board_id,
            category_id: data.category_id
        })
        .orderBy('id','desc');
    };

    static searchTodosByTitle = async (data: SearchTodoByTitle): Promise<TodoBaseData[]> => {
        return await knex('todos')
        .where('board_id', data.board_id)
        .andWhere('title', 'ilike', `%${data.keyword}%`) // fuzzy, case-insensitive
        .orderBy('id', 'desc');
    };
}