import knex from '@/lib/db/db'
import { AddLabelToTodo, FilterTodosByLabel, GetLabelsOnTodo, RemoveLabelFromTodo, TodoLabelsBaseData } from '../types/todoLabelTypes'
import { LabelBaseData } from '../types/labelTypes';
import { TodoBaseData } from '../types/todoTypes';
import { Labels } from './labels';
import { Todos } from './todos';

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

  //Displays all labels attached to a todo based on id
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

  // Fetch todos with their labels for a specific board
  static async getTodosWithLabels(boardId: number): Promise<(TodoBaseData & { labels: LabelBaseData[] })[]> {
    // 1. Fetch todos for this board
    const todos = await Todos.listTodosInBoard({ board_id: boardId });
      
    if (!todos.length) return [];
    
    const todoIds = todos.map(todo => todo.id);

    // 2. Fetch todo-label relations
    const todoLabels = await knex('todo_labels').whereIn('todo_id', todoIds);

    // 3. Fetch all labels for this board using Labels model
    const allLabels = await Labels.listAllLabelsInBoard({ board_id: boardId });

    // 4. Build a label map for quick lookup
    const labelMap = allLabels.reduce((acc, label) => {
      acc[label.id] = label;
      return acc;
    }, {} as Record<number, LabelBaseData>);

    // 5. Attach labels to each todo
    return todos.map(todo => ({
      ...todo,
      labels: todoLabels
        .filter(rel => rel.todo_id === todo.id)
        .map(rel => labelMap[rel.label_id])
        .filter(Boolean),
    }));
  };

  // Fetch todo by ID with labels
  static async getTodoByIdWithLabels( todoId: number): Promise<(TodoBaseData & { labels: LabelBaseData[] }) | null> {
    const todo = await Todos.getTodoById({ id: todoId });
    if (!todo) return null;

    const labels = await TodoLabels.getLabelsForTodo({ todo_id: todoId });

    return {
      ...todo,
      labels,
    };
  }

}