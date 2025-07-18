import knex, { Knex } from 'knex';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASS,
    database: process.env.PG_DB,
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
  },
};

const db = knex(config);

export default db;
