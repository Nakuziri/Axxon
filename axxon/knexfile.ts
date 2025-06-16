require("dotenv").config();
const path = require("path");

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING || {
      host: process.env.PG_HOST || "127.0.0.1",
      port: process.env.PG_PORT || 5432,
      user: process.env.PG_USER || "postgres",
      password: process.env.PG_PASS || "postgres",
      database: process.env.PG_DB || "postgres",
    },
    migrations: {
      directory: path.join(__dirname, "src", "lib", "db", "migrations"), 
    },
    seeds: {
      directory: path.join(__dirname, "src", "lib", "db", "seeds"), 
    },
  },

  production: {
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING,
    migrations: {
      directory: path.join(__dirname, "src", "lib", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "lib", "db", "seeds"),
    },
  },
};
