import knex from '@/lib/db/db'
import { AddLabelToTodo, FilterTodosByLabel, GetLabelsOnTodo, RemoveLabelFromTodo, TodoLabelsBaseData } from './types/todoLabelTypes'
import { LabelBaseData } from './types/labelTypes';
import { TodoBaseData } from './types/todoTypes';

//class for handling joined todos and labels
export class TodoLabels { 
    static addLabelToTodo = async (data: AddLabelToTodo ): Promise<TodoLabelsBaseData> => {
        const [todoLabel] = await knex('todo_labels')
        .insert({
            todo_id: data.todo_id,
            label_id: data.label_id
        })
        .returning('*');
        
        return todoLabel;
    };

    static removeLabelFromTodo = async (data: RemoveLabelFromTodo ): Promise<TodoLabelsBaseData | null> => {
        const [todoLabel] = await knex('todo_labels')
        .where({
            todo_id: data.todo_id,
            label_id: data.label_id
        })
        .del()
        .returning('*');

        return todoLabel || null;
    };

    //Displays all labels attached to a todo
    static getLabelsForTodo = async (data: GetLabelsOnTodo): Promise<LabelBaseData[]> => {
        return await knex('labels')
        .join('todo_labels', 'labels.id', 'todo_labels.label_id')// Join on label_id to connect todos and labels
        .where({'todo_labels.todo_id': data.todo_id})            // Filter by the todo_id
        .select('labels.*');                                     // Return full label data
    };

    static filterTodosByLabel = async (data: FilterTodosByLabel): Promise<TodoBaseData[]> => {
        return await knex('todos')
        .join('todo_labels', 'todos.id','todo_labels.todo_id')
        .where({'todo_labels.label_id': data.label_id})
        .select('todos.*');
    };
}