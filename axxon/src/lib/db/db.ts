const knex = require("knex");

const db = knex({
  client: "pg",
  connection: process.env.PG_CONNECTION_STRING || {
    host: process.env.PG_HOST || "127.0.0.1",
    port: Number(process.env.PG_PORT) || 5432,
    user: process.env.PG_USER || "postgres",
    password: process.env.PG_PASS || "postgres",
    database: process.env.PG_DB || "postgres",
  },
});

module.exports = db;
