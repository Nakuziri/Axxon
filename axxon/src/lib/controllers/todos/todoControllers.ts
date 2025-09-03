import { NextRequest, NextResponse } from 'next/server';
import { Todos } from '@/lib/models/todos';
import type { CreateTodoData, UpdateTodoData } from '@/lib/types/todoTypes';
import { publishBoardUpdate } from '@/lib/wsServer'
import { TodoLabels } from '@/lib/models/todoLabels';

/**
 * Create a new todo for the specified board.
 *
 * Attempts to create a todo from the request body, then publishes a realtime
 * `todo:created` board update with the hydrated todo (includes labels) if
 * hydration succeeds. Responds with the created todo (status 201) or a 500
 * JSON error on failure.
 *
 * @param params.boardId - Board identifier (stringified number) used to scope the todo and websocket channel.
 * @returns JSON response containing the created todo (201) or an error object (500).
 */
export async function POST(req: NextRequest, params: { boardId: string }) {
  try {
    const board_id = Number(params.boardId);
    const body = await req.json();

    const data: CreateTodoData = { ...body, board_id };
    const todo = await Todos.createTodo(data);

    // Fetch the full todo with labels
    const fullTodo = await TodoLabels.getTodosWithLabels(board_id);
    const createdTodo = fullTodo.find(t => t.id === todo.id);

    // --- PUBLISH TO WEBSOCKET ---
    if (createdTodo) {
      await publishBoardUpdate(String(board_id), {
        type: 'todo:created',
        payload: createdTodo
      });
    }

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error('[CREATE_TODO_ERROR]', error);
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

/**
 * Updates a todo in the specified board, hydrates it with labels, and publishes a realtime update.
 *
 * Accepts update fields in the request JSON body, combines them with `boardId` and `todoId` from route params,
 * applies the update, then retrieves the full todo with labels before publishing a `todo:updated` websocket event
 * for the board.
 *
 * @returns 200 with the updated todo object (including attached labels) on success, or 500 with `{ error: "Failed to update todo" }` on failure.
 */
export async function PATCH(req: NextRequest, params: { boardId: string; todoId: string }) {
  try {
    const id = Number(params.todoId);
    const board_id = Number(params.boardId);
    const body = await req.json();

    const data: UpdateTodoData = { ...body, id, board_id };

    const updated = await Todos.updateTodo(data);

    // Hydrate with labels (make sure your model supports this)
    const fullTodo = await TodoLabels.getTodoByIdWithLabels(updated!.id);

    // --- PUBLISH TO WEBSOCKET ---
    await publishBoardUpdate(String(board_id), {
      type: "todo:updated",
      payload: fullTodo,
    });

    // Returns full todo to client
    return NextResponse.json(fullTodo, { status: 200 });
  } catch (error) {
    console.error("[UPDATE_TODO_ERROR]", error);
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

/**
 * Deletes a todo by ID for a given board and publishes a board-level websocket update.
 *
 * Converts `params.boardId` and `params.todoId` to numbers, calls the Todos model to delete the todo,
 * and publishes a `'todo:deleted'` event (payload: `{ id }`) to the board channel.
 *
 * @returns JSON response containing `{ deleted }` with HTTP 200 on success, or `{ error: 'Failed to delete todo' }` with HTTP 500 on failure.
 */
export async function DELETE(_req: NextRequest, params: { boardId: string; todoId: string }) {
  try {
    const id = Number(params.todoId);
    const board_id = Number(params.boardId);

    const deleted = await Todos.deleteTodo({ id });

    // --- PUBLISH TO WEBSOCKET ---
    await publishBoardUpdate(String(board_id), {
      type: 'todo:deleted',
      payload: { id },
    });

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
