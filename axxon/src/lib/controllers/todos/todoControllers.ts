import { NextRequest, NextResponse } from 'next/server';
import { Todos } from '@/lib/models/todos';
import type { CreateTodoData, UpdateTodoData } from '@/lib/types/todoTypes';
import { publishBoardUpdate } from '@/lib/wsServer'

// Create Todo (POST /board/[boardId]/todos)
export async function POST(req: NextRequest, params: { boardId: string }) {
  try {
    const board_id = Number(params.boardId);
    const body = await req.json();

    const data: CreateTodoData = { ...body, board_id };
    const todo = await Todos.createTodo(data);

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('[CREATE_TODO_ERROR]', error);
    if (error instanceof Error) {
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
  }
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}

// List Todos (GET /board/[boardId]/todos)
export async function GET(_req: NextRequest, params: { boardId: string }) {
  try {
    const board_id = Number(params.boardId);
    const todos = await Todos.listTodosInBoard({ board_id });

    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    console.error('[LIST_TODOS_ERROR]', error);
    return NextResponse.json({ error: 'Failed to list todos' }, { status: 500 });
  }
}

// Update Todo (PATCH /board/[boardId]/todos/[todoId])
export async function PATCH(req: NextRequest, params: { boardId: string; todoId: string }) {
  try {
    const id = Number(params.todoId)
    const board_id = Number(params.boardId)
    const body = await req.json()

    const data: UpdateTodoData = { ...body, id, board_id }
    const todo = await Todos.updateTodo(data)

    // --- PUBLISH TO WEBSOCKET ---
    await publishBoardUpdate(board_id, { todo }) // sends the updated todo to all clients in this board room

    return NextResponse.json(todo, { status: 200 })
  } catch (error) {
    console.error('[UPDATE_TODO_ERROR]', error)
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}}

// Delete Todo (DELETE /board/[boardId]/todos/[todoId])
export async function DELETE(_req: NextRequest, params: { boardId: string; todoId: string }) {
  try {
    const id = Number(params.todoId);
    const deleted = await Todos.deleteTodo({ id });

    return NextResponse.json({ deleted }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_TODO_ERROR]', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}

// Get Todo by ID (GET /board/[boardId]/todos/[todoId])
export async function getTodoByIdController(_req: NextRequest, params: { boardId: string; todoId: string }) {
  try {
    const id = Number(params.todoId);
    const todo = await Todos.getTodoById({ id });

    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    console.error('[GET_TODO_BY_ID_ERROR]', error);
    return NextResponse.json({ error: 'Failed to retrieve todo' }, { status: 500 });
  }
}
