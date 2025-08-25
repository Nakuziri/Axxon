import knex from "knex";

export async function rollbackSeed() {
  // Inline your DB connection config here:
  const db = knex({
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING || {
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT) || 5432,
      user: process.env.PG_USER,
      password: process.env.PG_PASS,
      database: process.env.PG_DB,
    },
  });

  try {
    await db('todo_labels').del();
    await db('todos').del();
    await db('labels').del();
    await db('categories').del();
    await db('board_members').del();
    await db('boards').del();
    await db('users').del();

    console.log("Rollback complete.");
  } catch (error) {
    console.error("Rollback failed:", error);
  } finally {
    await db.destroy();
  }
}
