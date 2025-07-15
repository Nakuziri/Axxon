export type TodoLabelsBaseData = {
    todo_id: number
    label_id: number
}

export type AddLabelToTodo = TodoLabelsBaseData;
export type RemoveLabelFromTodo = TodoLabelsBaseData;
export type GetLabelsOnTodo = Pick<TodoLabelsBaseData, 'todo_id'>;
export type FilterTodosByLabel = Pick<TodoLabelsBaseData, 'label_id'>;