import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data in reverse FK order
  await knex('todo_labels').del();
  await knex('todos').del();
  await knex('labels').del();
  await knex('categories').del();
  await knex('board_members').del();
  await knex('boards').del();
  await knex('users').del();

  // Users
  const users = [
    {
      id: 1,
      first_name: "Xavier",
      last_name: "Campos",
      email: "xaviercampos2425@gmail.com",
      avatar_url: null,
    },
    {
      id: 2,
      first_name: "Alice",
      last_name: "Johnson",
      email: "alice.johnson@example.com",
      avatar_url: null,
    },
    {
      id: 3,
      first_name: "Bob",
      last_name: "Smith",
      email: "bob.smith@example.com",
      avatar_url: null,
    },
    {
      id: 4,
      first_name: "Carol",
      last_name: "Williams",
      email: "carol.williams@example.com",
      avatar_url: null,
    },
  ];
  await knex('users').insert(users);

  // Boards - 12 for Xavier, 3 others spread
  const boards = [
    // Xavier's boards
    { id: 1, name: "Xavier's Main Board", created_by: 1 },
    { id: 2, name: "Work Projects", created_by: 1 },
    { id: 3, name: "Personal ToDos", created_by: 1 },
    { id: 4, name: "Learning Goals", created_by: 1 },
    { id: 5, name: "Fitness Plans", created_by: 1 },
    { id: 6, name: "Travel Itinerary", created_by: 1 },
    { id: 7, name: "Home Renovations", created_by: 1 },
    { id: 8, name: "Shopping List", created_by: 1 },
    { id: 9, name: "Books to Read", created_by: 1 },
    { id: 10, name: "Music Projects", created_by: 1 },
    { id: 11, name: "Events Planning", created_by: 1 },
    { id: 12, name: "Side Hustle Ideas", created_by: 1 },

    // Other users' boards
    { id: 13, name: "Alice's Board", created_by: 2 },
    { id: 14, name: "Bob's Board", created_by: 3 },
    { id: 15, name: "Carol's Board", created_by: 4 },
  ];
  await knex('boards').insert(boards);

  // Board Members: Xavier is member on all his boards + Alice and Bob on some
  const boardMembers = [
    // Xavier on his boards
    ...boards.filter(b => b.created_by === 1).map(b => ({ board_id: b.id, user_id: 1 })),

    // Alice on board 1 and 13
    { board_id: 1, user_id: 2 },
    { board_id: 13, user_id: 2 },

    // Bob on boards 2 and 14
    { board_id: 2, user_id: 3 },
    { board_id: 14, user_id: 3 },

    // Carol on board 15 only
    { board_id: 15, user_id: 4 },
  ];
  await knex('board_members').insert(boardMembers);

  // Categories: 4 per board, with positions 1-4, random colors
  const categoryColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#33FFF2"];
  const categories: Array<{
    id?: number;
    board_id: number;
    name: string;
    color: string;
    position: number;
    is_done: boolean;
  }> = [];

  let categoryId = 1;
  for (const board of boards) {
    for (let pos = 1; pos <= 4; pos++) {
      categories.push({
        id: categoryId++,
        board_id: board.id,
        name: `Category ${pos} of Board ${board.id}`,
        color: categoryColors[pos % categoryColors.length],
        position: pos,
        is_done: pos === 4, // last category is "done"
      });
    }
  }
  await knex('categories').insert(categories);

  // Labels: 8 total, spread across boards (random colors)
  const labels = [
    { id: 1, board_id: 1, name: "Urgent", color: "#FF0000" },
    { id: 2, board_id: 1, name: "Bug", color: "#FF6600" },
    { id: 3, board_id: 2, name: "Feature", color: "#00FF00" },
    { id: 4, board_id: 2, name: "Backend", color: "#0000FF" },
    { id: 5, board_id: 3, name: "Frontend", color: "#FF00FF" },
    { id: 6, board_id: 3, name: "Low Priority", color: "#AAAAAA" },
    { id: 7, board_id: 4, name: "Research", color: "#00FFFF" },
    { id: 8, board_id: 4, name: "Testing", color: "#FFFF00" },
  ];
  await knex('labels').insert(labels);

  // Todos: 5 todos per category, assigned to Xavier if possible
  const todos: Array<{
    id?: number;
    board_id: number;
    title: string;
    description: string;
    due_date: Date | null;
    assignee_id: number | null;
    priority: number;
    category_id: number;
    is_complete: boolean;
  }> = [];

  let todoId = 1;
  for (const category of categories) {
    for (let i = 1; i <= 5; i++) {
      todos.push({
        id: todoId++,
        board_id: category.board_id,
        title: `Todo ${i} in Cat ${category.id} (Board ${category.board_id})`,
        description: `This is the description for todo ${i} in category ${category.name}`,
        due_date: new Date(Date.now() + i * 24 * 60 * 60 * 1000), // i days from now
        assignee_id: 1, // Xavier
        priority: (i % 3) + 1,
        category_id: category.id!,
        is_complete: i === 5, // last todo marked complete
      });
    }
  }
  await knex('todos').insert(todos);

  // Todo_Labels: randomly assign 1-3 labels per todo from labels of the same board
  const todoLabels: Array<{ todo_id: number; label_id: number }> = [];

  for (const todo of todos) {
    // get labels for the board of this todo
    const boardLabels = labels.filter(l => l.board_id === todo.board_id);
    // shuffle labels
    const shuffled = boardLabels.sort(() => 0.5 - Math.random());
    // take 1 to 3 labels
    const count = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < count && i < shuffled.length; i++) {
    todoLabels.push({ todo_id: todo.id!, label_id: shuffled[i].id });
    }
  }
  await knex('todo_labels').insert(todoLabels);

  console.log('Database seeded successfully!');
}