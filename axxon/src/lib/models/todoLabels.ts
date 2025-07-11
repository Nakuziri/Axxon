import knex from '@/lib/db/db'
import { addLabelToTodo, removeLabelFromTodo, TodoLabelsBaseData } from './types/todoLabelTypes'

//class for handling joined todos and labels
export class TodoLabels { 
    static addLabelToTodo = async (data: addLabelToTodo ): Promise<TodoLabelsBaseData> => {
        const [todoLabel] = await knex('todo_labels')
        .insert({
            todo_id: data.todo_id,
            label_id: data.label_id
        })
        .returning('*');
        
        return todoLabel;
    };

    static removeLabelFromTodo = async (data: removeLabelFromTodo ): Promise<TodoLabelsBaseData | null> => {
        const [todoLabel] = await knex('todo_labels')
        .where({
            todo_id: data.todo_id,
            label_id: data.label_id
        })
        .del()
        .returning('*');

        return todoLabel || null;
    };
}