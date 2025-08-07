import { LabelBaseData } from "./labelTypes";

export type TodoBaseData = {
    id: number
    board_id: number
    title: string
    description?: string
    due_date?: string
    assignee_id?: number
    priority?: number
    category_id?: number
    is_complete?: boolean
    created_at?: string
    updated_at?: string
};

export type CreateTodoData = {
  board_id: number;
  title: string;
  description?: string;
  due_date?: string;
  assignee_id?: number;
  priority?: number;
  category_id?: number;
  is_complete?: boolean;
};

export type DeleteTodoData = Pick<TodoBaseData, 'id'>;
export type UpdateTodoData = Partial<Pick<TodoBaseData, 'title' | 'description' | 'due_date' | 'assignee_id' | 'priority' | 'category_id' | 'is_complete'>> & { id: number };
export type ListAllTodosData = Pick<TodoBaseData, 'board_id'>
export type GetTodoByNameData = Pick<TodoBaseData, 'title' | 'board_id'>;
export type GetTodoByIdData = Pick<TodoBaseData, 'id'>;
export type GetTodoByCompletionData = Pick<TodoBaseData, 'is_complete'>;
export type GetTodoByAssigneeData = Pick<TodoBaseData, 'assignee_id' | 'board_id'>;
export type GetTodoByStatusData = Pick<TodoBaseData, 'category_id' | 'board_id'>;
export type SearchTodoByTitle = Pick<TodoBaseData,'board_id'> & {keyword: string}
export type TodoWithLabels = TodoBaseData & LabelBaseData;