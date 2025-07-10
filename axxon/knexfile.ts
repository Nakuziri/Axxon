require("dotenv").config({path: ".env.local"});
const path = require("path");

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING || {
      host: process.env.PG_HOST,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASS,
      database: process.env.PG_DB,
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