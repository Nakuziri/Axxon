import knex from '@/lib/db/db'
import { CreateTodoData, DeleteTodoData, GetTodoByIdData, GetTodoByNameData, ListAllTodosData, TodoBaseData, UpdateTodoData, GetTodoByCompletionData } from './types/todoTypes'

export class Todos {

    static createTodo = async(data: CreateTodoData): Promise<TodoBaseData> => {
        const[todo] = await knex('todos')
        .insert({
            board_id: data.board_id,
            title: data.title,
            description: data.description,
            due_date: data.due_date,
            assignee_id: data.assignee_id,
            priority: data.priority,
            category_id: data.category_id,
            is_complete: data.is_complete ?? false//default to false if undefined
        })
        .returning('*')

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


    
}
