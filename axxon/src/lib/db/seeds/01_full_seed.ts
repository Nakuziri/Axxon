import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Clear in reverse FK order
  await knex('todo_labels').del();
  await knex('todos').del();
  await knex('labels').del();
  await knex('categories').del();
  await knex('board_members').del();
  await knex('boards').del();
  await knex('users').del();

  // Users
  const users = [
    { first_name: "Xavier", last_name: "Campos", email: "xaviercampos2425@gmail.com", avatar_url: null },
    { first_name: "Alice", last_name: "Johnson", email: "alice.johnson@example.com", avatar_url: null },
    { first_name: "Bob", last_name: "Smith", email: "bob.smith@example.com", avatar_url: null },
    { first_name: "Carol", last_name: "Williams", email: "carol.williams@example.com", avatar_url: null },
  ];
  const insertedUsers = await knex('users').insert(users).returning(['id', 'email']);

  const userMap = Object.fromEntries(insertedUsers.map(u => [u.email, u.id]));
  const xavierId = userMap["xaviercampos2425@gmail.com"];

  // Boards (100 total, 30+ to Xavier)
  const boardColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#A833FF', '#33FFF2'];
  const boards = [];

  for (let i = 0; i < 100; i++) {
    const created_by = i < 30 ? xavierId : insertedUsers[i % insertedUsers.length].id;
    boards.push({
      name: `Board ${i + 1}`,
      created_by,
      color: boardColors[i % boardColors.length],
    });
  }

  const insertedBoards = await knex('boards').insert(boards).returning(['id', 'created_by']);

  // Board members with deduplication
  const boardMembers = [];

  for (const board of insertedBoards) {
    const membersSet = new Set<string>();

    // Add owner
    boardMembers.push({ board_id: board.id, user_id: board.created_by });
    membersSet.add(`${board.id}_${board.created_by}`);

    // Add Xavier as member if not owner and 20% chance
    if (board.created_by !== xavierId && Math.random() < 0.2) {
      if (!membersSet.has(`${board.id}_${xavierId}`)) {
        boardMembers.push({ board_id: board.id, user_id: xavierId });
        membersSet.add(`${board.id}_${xavierId}`);
      }
    }

    // Add 1-2 random collaborators (excluding owner)
    const otherUsers = insertedUsers.filter(u => u.id !== board.created_by);
    const collaboratorCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < collaboratorCount; i++) {
      const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
      const key = `${board.id}_${randomUser.id}`;
      if (!membersSet.has(key)) {
        boardMembers.push({ board_id: board.id, user_id: randomUser.id });
        membersSet.add(key);
      }
    }
  }
  await knex('board_members').insert(boardMembers);

  // Categories: 4 per board
  const categoryColors = boardColors;
  const categories = [];

  for (const board of insertedBoards) {
    for (let pos = 1; pos <= 4; pos++) {
      categories.push({
        board_id: board.id,
        name: `Category ${pos}`,
        color: categoryColors[pos % categoryColors.length],
        position: pos,
        is_done: pos === 4,
      });
    }
  }

  const insertedCategories = await knex('categories').insert(categories).returning(['id', 'board_id']);

  // Labels: 5 per board
  const labels = [];
  for (const board of insertedBoards) {
    for (let i = 0; i < 5; i++) {
      labels.push({
        board_id: board.id,
        name: `Label ${i + 1}`,
        color: categoryColors[i % categoryColors.length],
      });
    }
  }

  const insertedLabels = await knex('labels').insert(labels).returning(['id', 'board_id']);

  // Todos: 6 per category (2400+ todos)
  const todos = [];
  for (const [i, cat] of insertedCategories.entries()) {
    for (let j = 1; j <= 6; j++) {
      todos.push({
        board_id: cat.board_id,
        title: `Task ${j} in Category ${cat.id}`,
        description: `Auto-generated todo ${j} under category ${cat.id}`,
        due_date: new Date(Date.now() + j * 86400000),
        assignee_id: xavierId,
        priority: (j % 3) + 1,
        category_id: cat.id,
        is_complete: j === 6,
      });
    }
  }

  const insertedTodos = await knex('todos').insert(todos).returning(['id', 'board_id']);

  // Todo Labels: 1–3 per todo, from same board
  const todoLabels = [];

  for (const [i, todo] of insertedTodos.entries()) {
    const boardId = todo.board_id;
    const labelPool = insertedLabels.filter(l => l.board_id === boardId);
    const count = Math.floor(Math.random() * 3) + 1;
    const shuffled = labelPool.sort(() => 0.5 - Math.random()).slice(0, count);

    for (const label of shuffled) {
      todoLabels.push({ todo_id: todo.id, label_id: label.id });
    }
  }

  await knex('todo_labels').insert(todoLabels);

  console.log(`🌱 Seed complete:
  - Users: ${insertedUsers.length}
  - Boards: ${insertedBoards.length}
  - Categories: ${insertedCategories.length}
  - Labels: ${insertedLabels.length}
  - Todos: ${insertedTodos.length}
  - TodoLabels: ${todoLabels.length}`);
}

export async function rollbackSeed(knex: Knex): Promise<void> {
  // Delete in reverse order of dependencies to avoid FK errors
  await knex('todo_labels').del();
  await knex('todos').del();
  await knex('labels').del();
  await knex('categories').del();
  await knex('board_members').del();
  await knex('boards').del();
  await knex('users').del();
}
  console.log("🌱 Rollback complete.");